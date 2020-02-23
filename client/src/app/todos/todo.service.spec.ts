import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('Todo service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
        _id: 'thomas_id',
        owner: 'thomas',
        status: true,
        body: 'You are tasked with doing a speedrun of the 1997 video game "GoldenEye" for the Nintendo 64 console.',
        category: 'video games'
    },
    {
        _id: 'mark_id',
        owner: 'mark',
        status: false,
        body: 'Tonight is game night. You have to bring one of the following: (1) super smash bros; (2) mario party; (3) goldeneye.',
        category: 'video games'
    },
    {
        _id: 'thomas_id',
        owner: 'thomas',
        status: true,
        body: 'You are tasked with completing your taxes for 2019. You can use TurboTax, HR Block, or a CPA.',
        category: 'adulting'
    }
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoService.todoUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'category\'', () => {

    todoService.getTodos({ category: 'video games' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the category parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('category')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the category parameter was 'video games'
    expect(req.request.params.get('category')).toEqual('video games');

    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'contains\'', () => {

    todoService.getTodos({ contains: 'You are tasked' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the contains parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('contains')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the contains parameter was 'You are tasked'
    expect(req.request.params.get('contains')).toEqual('You are tasked');

    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with multiple filter parameters', () => {

    todoService.getTodos({ owner: 'thomas', category: 'video games', status: true }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the supplied filter parameters.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl)
        && request.params.has('owner') && request.params.has('category') && request.params.has('status')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the filter parameters are correct
    expect(req.request.params.get('owner')).toEqual('thomas');
    expect(req.request.params.get('category')).toEqual('video games');
    expect(req.request.params.get('status')).toBeTruthy();

    req.flush(testTodos);
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('filterTodos() filters by owner', () => {
    expect(testTodos.length).toBe(3);
    const todoOwner = 'mark';
    expect(todoService.filterTodos(testTodos, { owner: todoOwner }).length).toBe(1);
  });

  it('filterTodos() filters by status', () => {
    expect(testTodos.length).toBe(3);
    const todoStatus = 'complete';
    expect(todoService.filterTodos(testTodos, { status: todoStatus }).length).toBe(2);
  });

  it('filterTodos() filters by owner and status', () => {
    expect(testTodos.length).toBe(3);
    const todoOwner = 'mark';
    const todoStatus = 'incomplete';
    expect(todoService.filterTodos(testTodos, { owner: todoOwner, status: todoStatus }).length).toBe(1);
  });
});