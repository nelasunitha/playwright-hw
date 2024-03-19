import { type Locator, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class TodoPage extends BasePage {
  readonly inputBox: Locator
  readonly todoItem: Locator
  readonly modal: Locator
  readonly header: Locator
  readonly addButton: Locator
  readonly search: Locator
  readonly noTask: Locator
  readonly itemList: Locator


  constructor(page: Page) {
    super(page)
    this.inputBox = page.locator('#input-add')
    this.todoItem = page.locator('.todo-item:not(.has-text-danger)')
    this.modal =page.locator('.panel')
    this.header = page.locator('.panel-heading')
    this.addButton = page.locator('#add-btn')
    this.search = page.locator('#search')
    this.noTask = page.locator('.has-text-danger')
    //this.itemList = page.locator('.panel-block.todo-item.Projects_hover__6uEQG')
    this.itemList = page.locator('#panel')
  }

  async goto() {
    await this.page.goto('https://techglobal-training.com/frontend/project-6')
  }

  async addTodo(text: string) {
    await this.inputBox.fill(text)
    await this.inputBox.press('Enter')
  }

  async remove(text: string) {
    const todo = this.todoItem.filter({ hasText: text })
    await todo.hover()

    await todo.locator('.destroy').click()
  }

  async removeAll() {
    while ((await this.todoItem.count()) > 0) {
      await this.todoItem.first().hover()
      await this.todoItem.locator('.destroy').first().click()
    }
  }
  async getTodoItems(text: string) {
    const displayedItems = [];
    const itemList = await this.itemList.all(); // Use all() instead of elements()

    // Loop through each todo item element and retrieve its text content
    for (const item of itemList) {
      const itemText = await item.textContent();
      displayedItems.push(itemText);
    }

    // Validate that displayed todo items match the expected todo items

  }

}