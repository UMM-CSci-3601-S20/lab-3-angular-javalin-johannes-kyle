import {TodoPage} from './todo-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    page.typeInput('todo-owner-input', 'Blanche');

    // All of the todo cards should have the owner we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-owner')).getText()).toEqual('Owner: Blanche');
    });
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    page.typeInput('todo-owner-input', 'blaNchE');

    // All of the todo cards should have the owner we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-owner')).getText()).toEqual('Owner: Blanche');
    });
  });


  it('Should type something in the category filter and check that it returned correct elements', () => {
    page.typeInput('todo-category-input', 'software design');

    // All of the todo cards should have the owner we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-category')).getText()).toEqual('Category: software design');
    });
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    page.typeInput('todo-category-input', 'SOftwarE design');

    // All of the todo cards should have the category we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-category')).getText()).toEqual('Category: software design');
    });
  });

  it('Should select an option of the status filter and check that it returned correct elements', () => {
    page.selectMatSelectValue('todo-status-select', 'incomplete');

    // All of the todo cards should have the status we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-status')).getText()).toEqual('Status: incomplete');
    });
  });

  it('Should select an option of the status filter and check that it returned correct elements', () => {
    page.selectMatSelectValue('todo-status-select', 'complete');

    // All of the todo cards should have the status we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-status')).getText()).toEqual('Status: complete');
    });
  });


  it('Should select an option of the order filter and check that it returned correct elements (first three)', () => {
    page.selectMatSelectValue('todo-orderBy-select', 'status');
    page.typeInput('todo-limit-input', '3');
    // All of the todo cards should have the status we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-status')).getText()).toEqual('Status: incomplete');
    });
  });
 });
