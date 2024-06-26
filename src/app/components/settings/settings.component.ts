import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  animations: [
    trigger('inAndOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SettingsComponent implements OnInit {
  ngOnInit(): void {
    // this.firebaseService
    //   .getPhoto()
    //   .then((data) => {
    //     this.isPhoto = data;
    //   })
    //   .catch(() => {
    //     this.isPhoto = 'assets/images/no_profile.jpg';
    //   });
  }
  todosService = inject(TodosService);
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  file?: File;
  previewFile?: string | undefined;

  isEditProfile = false;
  isLoading = false;
  isUpdating = false;

  username = this.user?.username;

  get isPhoto() {
    return this.todosService.isPhoto;
  }

  get user() {
    return this.authService.currnetUserSig();
  }

  get isVisible() {
    return this.todosService.isSettings;
  }

  close() {
    this.todosService.isSettings = false;
  }

  onEdit() {
    this.isEditProfile = true;
  }

  onPhotoUpload() {
    if (this.file) {
      this.isLoading = true;
      this.firebaseService.uploadPhoto(this.file).subscribe(() => {
        this.todosService.getPhoto();
        this.isLoading = false;
      });
      this.previewFile = undefined;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.previewFile = (window.URL || window.webkitURL).createObjectURL(file);
    }
  }

  cancel() {
    this.previewFile = undefined;
  }

  cancelEdit() {
    this.isEditProfile = false;
  }

  updateProfile() {
    this.isUpdating = true;
    if (this.username) {
      this.authService.updateProfile(this.username).then(() => {
        this.isUpdating = false;
        this.isEditProfile = false;
      });
    }
  }
}
