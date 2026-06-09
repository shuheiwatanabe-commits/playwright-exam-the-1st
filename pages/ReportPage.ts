import { Page, Locator } from '@playwright/test';

export class ReportPage {
  readonly page: Page;
  readonly dateFilter: Locator;
  readonly clearDateButton: Locator;
  readonly assigneeFilter: Locator;
  readonly exportButton: Locator;
  readonly statsGrid: Locator;
  readonly reportTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dateFilter      = page.getByTestId('report-date');
    this.clearDateButton = page.getByTestId('report-clear-date');
    this.assigneeFilter  = page.getByTestId('report-assignee');
    this.exportButton    = page.getByTestId('report-export-btn');
    this.statsGrid       = page.locator('#stats-grid');
    this.reportTable     = page.getByTestId('report-table');
  }

  async navigate() {
    await this.page.waitForLoadState('networkidle');
    await this.page.getByTestId('nav-report').click();
  }

  async filterByDate(date: string) {
    await this.dateFilter.fill(date);
  }

  async clearDateFilter() {
    await this.clearDateButton.click();
  }

  async filterByAssignee(assignee: string) {
    await this.assigneeFilter.selectOption(assignee);
  }

  async getReportRowCount(): Promise<number> {
    return await this.reportTable.locator('tr').count();
  }

  getReportRowByTaskId(id: number): Locator {
    return this.page.getByTestId(`report-row-${id}`);
  }

  async getStatValues(): Promise<number[]> {
    const cards = this.statsGrid.locator('.stat-num');
    const count = await cards.count();
    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).innerText();
      values.push(Number(text));
    }
    return values;
  }

  async exportReport() {
    await this.exportButton.click();
  }
}
