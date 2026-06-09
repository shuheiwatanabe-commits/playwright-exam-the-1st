import { Page, Locator } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly filterStatus: Locator;
  // TODO: 担当者フィルターのlocatorを追加する
  readonly filterAssignee: Locator;
  readonly addTaskButton: Locator;
  readonly taskList: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput   = page.getByTestId('search-input');
    this.filterStatus  = page.getByTestId('filter-status');
    // TODO: filter-assignee の locator を追加する
    this.filterAssignee = page.getByTestId('filter-assignee');
    this.addTaskButton = page.getByTestId('add-task-btn');
    this.taskList      = page.getByTestId('task-list');
    this.emptyState    = page.locator('#empty-state');
  }

  async navigate() {
    await this.page.getByTestId('nav-tasks').click();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async filterByStatus(status: 'all' | 'todo' | 'doing' | 'review' | 'done') {
    await this.filterStatus.selectOption(status);
  }

  // TODO: 担当者でフィルターするメソッドを追加する
  // filterByAssignee(assignee: string): Promise<void>

  async filterByAssignee(assignee: string): Promise<void> {
    await this.filterAssignee.selectOption(assignee);
  }

  async getTaskCount(): Promise<number> {
    return await this.taskList.locator('[data-testid="task-card"]').count();
  }

  async getTaskTitle(id: number): Promise<string> {
    return await this.page.getByTestId(`task-title-${id}`).innerText();
  }

  async getTaskStatus(id: number): Promise<string> {
    return await this.page.getByTestId(`task-status-${id}`).innerText();
  }

  // TODO: 担当者テキストを取得するメソッドを追加する
  // getTaskAssignee(id: number): Promise<string>


  async getTaskAssignee(id: number): Promise<string> {
    return await this.page.getByTestId(`task-assignee-${id}`).innerText();
  }

  // TODO: メモテキストを取得するメソッドを追加する
  // getTaskMemo(id: number): Promise<string>

  async getTaskMemo(id: number): Promise<string> {
    return await this.page.getByTestId(`task-memo-${id}`).innerText();
  }

  async clickEdit(id: number) {
    await this.page.getByTestId(`edit-btn-${id}`).click();
  }

  async clickDelete(id: number) {
    await this.page.getByTestId(`delete-btn-${id}`).click();
  }

  async confirmDelete() {
    await this.page.getByTestId('confirm-delete').click();
  }
}
