import { Component, OnInit, importProvidersFrom, inject } from '@angular/core';

import { TodosService } from '../services/todos.service';
import { Tag, Todo } from '../models/todos.model';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-todos-section',
  standalone: true,
  templateUrl: './todos-section.component.html',
  styleUrl: './todos-section.component.css',
  imports: [FormsModule, DatePipe, TitleCasePipe],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TodosSectionComponent implements OnInit {
  constructor(private todosService: TodosService) {}
  firebaseService = inject(FirebaseService);
  errorService = inject(ErrorService);
  ngOnInit() {
    this.firebaseService.getTodos().subscribe((todos) => {
      this.todosService.setTodos(todos);
    });
  }

  get tags() {
    return this.todosService.tags;
  }

  get todos() {
    return this.todosService.todos;
  }

  get selectedTag() {
    return this.todosService.selectedTag;
  }

  content = '';

  date = '';

  selectedTagSelect = '';

  openDatePicker(dateInput: HTMLInputElement) {
    dateInput.showPicker();
  }

  setContent() {
    this.todosService.setContent(this.content);
  }

  completeTask(todo: any) {
    this.firebaseService.updateDone(todo);
  }

  setDate() {
    this.todosService.setDate(new Date(this.date));
  }

  onSubmit() {
    this.setContent();
    this.setDate();

    const result = this.todosService.createTodo();
    if (result) {
      this.content = '';
      this.date = '';
    }
  }

  findTag(tagId: string) {
    const tag: Tag[] = this.tags.filter((tag) => tag.id === tagId);
    return tag[0].color;
  }

  selectTag(tag: Tag) {
    this.todosService.setTag(tag);
  }

  showSelectTag() {
    if (this.tags.length === 0) {
      this.errorService.isError = true;
      this.errorService.errorMessage = { message: 'Create atleast one tag' };
    } else {
      if (this.errorService.isError) {
        this.errorService.resetError();
      }
      this.todosService.isSelectTag = true;
    }
  }
}
