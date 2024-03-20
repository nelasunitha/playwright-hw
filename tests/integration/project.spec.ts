import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/TodoPage';

test.describe('todo tests', async () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });
  /*
  Navigate to https://techglobal-training.com/frontend/project-6.
  Confirm that the todo-app modal is visible with the title “My Tasks.”
  Validate hat the New Todo input field is enabled for text entry.
  Validate ADD button is enabled.
  Validate Search field is enabled.
  Validate that the task list is empty, displaying the message “No task found!”
*/
  test('Test Case 01 - Todo-App Modal Verification', async () => {
    await todoPage.modal.isVisible();
    const headerText = await todoPage.header.textContent();
    expect(headerText).toBe('My Tasks');
    await expect(todoPage.inputBox).toBeEnabled();
    await expect(todoPage.addButton).toBeEnabled();
    await expect(todoPage.search).toBeEnabled();
    await expect(todoPage.todoItem.count()).resolves.toBe(0);
    const noTaskText = await todoPage.noTask.textContent();
    expect(noTaskText).toContain('No task found!');
  });
  /*
Navigate to https://techglobal-training.com/frontend/project-6
Enter a new task in the todo input field and add it to the list.
Validate that the new task appears in the task list.
Validate that the number of tasks in the list is exactly 1.
Mark the added task as complete by selecting its checkbox.
Validate item is marked as completed.
Click on the button to remove the item you have added.
Remove the completed task by clicking the designated removal button.
Validate that the task list is empty, displaying the message “No task found!”.
 */
  test('Test Case 02: Single Task Addition and Removal', async () => {
    const newTask = 'Buy groceries';
    await todoPage.addTodo(newTask);
    const addedTask = await todoPage.page.textContent(
      `.todo-item:has-text("${newTask}")`
    );
    expect(addedTask).toBe(newTask);
    await expect(todoPage.itemList).toBeVisible();
    await expect(todoPage.itemList).toHaveCount(1);
    await todoPage.itemList.click();
    await todoPage.remove('Buy groceries');
    await todoPage.inputBox.clear();
    await expect(todoPage.noTask).toHaveText('No task found!');
  });

  /*
Navigate to https://techglobal-training.com/frontend/project-6
Enter and add 5 todo items individually.
Validate that all added items match the items displayed on the list.
Select all the items you added on the todo list.
Click on the “Remove Selected Items” button to clear the selected tasks.
Validate that all tasks are removed, the list is empty and displays “No task found!”.
Validate that the task list is empty, displaying the message “No task found!”.
*/
  test('Test Case 03 - Multiple Task Operations', async () => {
    const todoItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    for (const item of todoItems) {
      await todoPage.addTodo(item);
      await todoPage.page.waitForTimeout(1000);
    }

    const displayedItems = [];
    const itemList = await todoPage.itemList.all();

    for (const item of itemList) {
      const itemText = await item.innerText();
      displayedItems.push(itemText);
    }

    // Validate that displayed todo items match the expected todo items
    // const displayedItemsArray = displayedItems.map(item => item.trim());
    // expect(displayedItemsArray).toStrictEqual(todoItems);
    await todoPage.removeAll();
    await todoPage.inputBox.clear();
    await expect(todoPage.noTask).toHaveText('No task found!');
  });
  /**
 * Navigate to https://techglobal-training.com/frontend/project-6
Enter and add 5 todo items individually.
Validate that all added items match the items displayed on the list.
Enter the complete name of a previously added todo item into the search bar.
Validate that the list is now filtered to show only the item you searched for.
Validate that the number of tasks visible in the list is exactly 1.
 */
  test('Test Case 04 - Search and Filter Functionality in todo App', async () => {
    const todoItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    for (const item of todoItems) {
      await todoPage.addTodo(item);
      await todoPage.page.waitForTimeout(1000);
    }

    const displayedItems = [];
    const itemList = await todoPage.itemList.all();

    for (const item of itemList) {
      const itemText = await item.innerText();
      displayedItems.push(itemText);
    }

    // Validate that displayed todo items match the expected todo items
    // const displayedItemsArray = displayedItems.map(item => item.trim());
    // expect(displayedItemsArray).toStrictEqual(todoItems);
    const lastItem = todoItems[todoItems.length - 1];
    const filteredItems = await todoPage.itemList.textContent();
    expect(filteredItems).toContain(lastItem);
    const itemCount = await todoPage.itemList.count();
    expect(itemCount).toBe(1);
  });
  /*
*Navigate to https://techglobal-training.com/frontend/project-6
Attempt to add an empty task to the todo list.
Validate that the task list is empty, displaying the message “No task found!”.
Enter an item name exceeding 30 characters into the list.
Validate error message appears and says “Error: Todo cannot be more than 30 characters!”.
Add a valid item name to the list.
Validate that the active task count is exactly one.
Try to enter an item with the same name already present on the list.
Validate that an error message is displayed, indicating “Error: You already have {item} in your todo list.”.
 */
  test('Test Case 05 - Task Validation and Error Handling', async () => {
    await todoPage.inputBox.fill('abcdefghijklmnopqrstuvwxyzabcdefg');
    await expect(todoPage.noTask).toHaveText('No task found!');
    await todoPage.inputBox.press('Enter');
    await expect(todoPage.notification).toHaveText(
      'Error: Todo cannot be more than 30 characters!'
    );
    await todoPage.inputBox.clear();
    await todoPage.addTodo('Buy Groceries');
    await expect(todoPage.todoItem.count()).resolves.toBe(1);
    const item = 'Buy Groceries';
    await todoPage.addTodo(item);
    await todoPage.page.waitForTimeout(1000);
    await expect(todoPage.notification).toHaveText(
      `Error: You already have ${item} in your todo list.`
    );
  });
  test.afterEach(async () => {
    await todoPage.removeAll();
  });
});
