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

  it('Should type something in the name filter and check that it returned correct elements', () => {
    page.typeInput('todo-name-input', 'Lynn Ferguson');

    // All of the todo cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-name')).getText()).toEqual('Lynn Ferguson');
    });
  });

  it('Should type something in the company filter and check that it returned correct elements', () => {
    page.typeInput('todo-company-input', 'OHMNET');

    // All of the todo cards should have the company we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-company')).getText()).toEqual('OHMNET');
    });
  });

  it('Should type something partial in the company filter and check that it returned correct elements', () => {
    page.typeInput('todo-company-input', 'ti');

    // Go through each of the cards that are being shown and get the companies
    const companies = page.getTodoCards().map(e => e.element(by.className('todo-card-company')).getText());

    // We should see these companies
    expect(companies).toContain('MOMENTIA');
    expect(companies).toContain('KINETICUT');

    // We shouldn't see these companies
    expect(companies).not.toContain('DATAGENE');
    expect(companies).not.toContain('OHMNET');
  });

  it('Should type something in the age filter and check that it returned correct elements', () => {
    page.typeInput('todo-age-input', '27');

    // Go through each of the cards that are being shown and get the names
    const names = page.getTodoCards().map(e => e.element(by.className('todo-card-name')).getText());

    // We should see these users whose age is 27
    expect(names).toContain('Stokes Clayton');
    expect(names).toContain('Bolton Monroe');
    expect(names).toContain('Merrill Parker');

    // We shouldn't see these users
    expect(names).not.toContain('Connie Stewart');
    expect(names).not.toContain('Lynn Ferguson');
  });

  it('Should change the view', () => {
    page.changeView('list');

    expect(page.getTodoCards().count()).toEqual(0); // There should be no cards
    expect(page.getTodoListItems().count()).toBeGreaterThan(0); // There should be list items
  });

  it('Should select a role, switch the view, and check that it returned correct elements', () => {
    page.selectMatSelectValue('todo-role-select', 'viewer');

    page.changeView('list');

    // All of the todo list items should have the role we are looking for
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-role')).getText()).toEqual('viewer');
    });
  });

  it('Should click view profile on a todo and go to the right URL', () => {
    page.clickViewProfile(page.getTodoCards().first());

    // When the view profile button on the first todo card is clicked, we should be sent to the right URL
    page.getUrl().then(url => {
      expect(url.endsWith('/users/588935f57546a2daea44de7c')).toBe(true);
    });

    // On this profile page we were sent to, the name should be correct
    expect(element(by.className('todo-card-name')).getText()).toEqual('Connie Stewart');
  });

});
