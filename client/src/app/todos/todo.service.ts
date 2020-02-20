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

  getTodos(filters?: { status?: boolean, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.status) {
        if (filters.status === true) {
          httpParams = httpParams.set('status', 'complete');
        } else {
          httpParams = httpParams.set('status', 'incomplete');
        }
      }
      if (filters.contains) {
        httpParams = httpParams.set('contains', filters.contains);
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.orderBy) {
        httpParams = httpParams.set('orderBy', filters.orderBy);
      }
      if (filters.limit) {
        httpParams = httpParams.set('limit', filters.limit);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { status?: string, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string  }): Todo[] {

    let filteredTodos = todos;

    // Filter by status
    if (filters.status) {
      if (filters.status === 'complete') {
        filteredTodos = filteredTodos.filter(todo => {
          return todo.status === true;
        });
      } else if (filters.status === 'incomplete') {
        filteredTodos = filteredTodos.filter(todo => {
          return todo.status === false;
        });
      } else {
        throw new Error(
          'Invalid status filter. Use complete or incomplete.'
        );
      }
    }

    // Filter by contains
    if (filters.contains) {
      filters.contains = filters.contains.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => {
        return todo.body.toLowerCase().includes(filters.contains) === true;
      });
    }

    // Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.owner.toLowerCase().indexOf(filters.owner) !== -1;
      });
    }

    // Filter by category
    if (filters.category) {
      filters.category = filters.category.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.category.toLowerCase().indexOf(filters.category) !== -1;
      });
    }

    // Filter by orderBy
    if (filters.orderBy) {
      filters.orderBy = filters.orderBy.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.company.toLowerCase().indexOf(filters.orderBy) !== -1;
      });
    }

    // Filter by limit
    if (filters.limit) {
      filters.limit = filters.limit.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return
      })
    }

    return filteredTodos;
  }
}
