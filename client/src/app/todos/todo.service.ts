import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';

@Injectable()
export class TodoService {
  readonly todoUrl: string = environment.API_URL + 'todos';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { age?: number, company?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.role) {
        httpParams = httpParams.set('role', filters.role);
      }
      if (filters.age) {
        httpParams = httpParams.set('age', filters.age.toString());
      }
      if (filters.company) {
        httpParams = httpParams.set('company', filters.company);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { name?: string, company?: string }): Todo[] {

    let filteredTodos = todos;

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.name.toLowerCase().indexOf(filters.name) !== -1;
      });
    }

    // Filter by company
    if (filters.company) {
      filters.company = filters.company.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.company.toLowerCase().indexOf(filters.company) !== -1;
      });
    }

    return filteredTodos;
  }
}
