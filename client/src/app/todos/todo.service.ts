import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { filter } from 'minimatch';

@Injectable()
export class TodoService {
  readonly todoUrl: string = environment.API_URL + 'todos';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { status?: string, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
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

    // Sort by orderBy
    if (filters.orderBy) {
      filters.orderBy = filters.orderBy.toLowerCase();
      switch(filters.orderBy) {
        case 'owner': {
          filteredTodos.sort((o1, o2) => {
            if (o1.owner.localeCompare(o2.owner) === 1) {
              return 1;
            } else if (o1.owner.localeCompare(o2.owner) === -1) {
              return -1;
            } else {
              return 0;
            }
          });
          break;
        }

        case 'body': {
          filteredTodos.sort((o1, o2) => {
            if (o1.body.localeCompare(o2.body) === 1) {
              return 1;
            } else if (o1.body.localeCompare(o2.body) === -1) {
              return -1;
            } else {
              return 0;
            }
          });
          break;
        }

        case 'status': {
          filteredTodos.sort((o1, o2) => {
            if (this.compareBoolean(o1.status, o2.status) === -1) {
              return -1;
            } else if (this.compareBoolean(o1.status, o2.status) === 1) {
              return 1;
            } else {
              return 0;
            }
          });
          break;
        }

        case 'category': {
          filteredTodos.sort((o1, o2) => {
            if (o1.category.localeCompare(o2.category) === 1) {
              return 1;
            } else if (o1.category.localeCompare(o2.category) === -1) {
              return -1;
            } else {
              return 0;
            }
          });
          break;
        }
      }
    }

    // Filter by limit
    if (filters.limit){
      if (filters.limit.replace(/\s/g, '')) {
        const limit: number = Number(filters.limit);
        if (!Number.isNaN(limit)) {
          return filteredTodos.slice(0, limit);
        }
      }
    }
    return filteredTodos;
  }
    compareBoolean(b1: boolean, b2: boolean): number {
      if (b1 === b2) {
        return 0;
      } else if (!b1 && b2) {
          return -1;
      } else {
          return 1;
      }
    }
}
