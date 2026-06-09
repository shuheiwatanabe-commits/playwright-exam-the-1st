import { type Page, type Locator } from '@playwright/test';

export class NotificationPage {
  readonly page: Page;

  // 🧭 ナビゲーションボタン
  readonly navNotificationButton: Locator;

  // トグル（Locator）
  readonly notifAssign: Locator;
  readonly notifDue: Locator;
  readonly notifComment: Locator;
  readonly notifMention: Locator;
  readonly notifWeekly: Locator;

  // ボタン
  readonly saveButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 遷移用ボタン
    this.navNotificationButton = page.getByTestId('nav-notification');

    // データIDダイレクトロックオン
    this.notifAssign  = page.getByTestId('notif-assign');
    this.notifDue     = page.getByTestId('notif-due');
    this.notifComment = page.getByTestId('notif-comment');
    this.notifMention = page.getByTestId('notif-mention');
    this.notifWeekly  = page.getByTestId('notif-weekly');

    /**
     * 🎯【ボタンロケーター最終修正】
     * F12の成果を100%反映！
     * 信頼度No.1の getByTestId で「save-notif-btn」「reset-notif-btn」を完璧に捕捉します。
     */
    this.saveButton   = page.getByTestId('save-notif-btn');
    this.resetButton  = page.getByTestId('reset-notif-btn');
  }

  // 画面遷移
  async navigate() {
    await this.navNotificationButton.click();
  }

  // トグルの現在の状態（ON / OFF）を取得
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // 隠れたチェックボックスを安全に操作するトグルメソッド
  async toggle(locator: Locator, shouldEnable: boolean) {
    const currentStatus = await this.isChecked(locator);

    if (shouldEnable !== currentStatus) {
      await locator.evaluate((el: HTMLInputElement) => el.click());
    }
  }

  // 保存ボタン
  async save() {
    await this.saveButton.click();
  }

  // リセットボタン
  async reset() {
    await this.resetButton.click();
  }
}