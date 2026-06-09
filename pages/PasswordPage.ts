import { type Page, type Locator } from '@playwright/test';

// 🎯 ポイント1: 「export class」で始める（defaultなどは付けない）
export class PasswordPage {
  readonly page: Page;

  // 🧭 ナビゲーションボタン
  readonly navPasswordButton: Locator;

  // 入力フィールド
  readonly currentInput: Locator;
  readonly newInput: Locator;
  readonly confirmInput: Locator;

  // ボタン
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // エラーメッセージ
  readonly currentError: Locator;
  readonly currentWrongError: Locator;
  readonly newError: Locator;
  readonly confirmError: Locator;

  // 🎯 ポイント2: 綴りは「constructor」すべて小文字
  constructor(page: Page) {
    this.page = page;

    // ナビゲーションボタン
    this.navPasswordButton = page.getByTestId('nav-password');

    // 各入力フィールド（F12の成果）
    this.currentInput = page.getByTestId('pw-current');
    this.newInput     = page.getByTestId('pw-new');
    this.confirmInput = page.getByTestId('pw-confirm');

    // 各ボタン（F12の成果）
    this.saveButton   = page.getByTestId('save-pw-btn');
    this.cancelButton = page.getByTestId('cancel-pw-btn');

    // 各エラーメッセージ
    this.currentError      = page.locator('#pw-current-error');
    this.currentWrongError = page.locator('#pw-current-wrong');
    this.newError          = page.locator('#pw-new-error');
    this.confirmError      = page.locator('#pw-confirm-error');
  }

  // 画面遷移メソッド
  async navigate() {
    await this.navPasswordButton.click();
  }

  // 各入力フィールドを埋めるアクション群
  async fillCurrentPassword(val: string) {
    await this.currentInput.fill(val);
  }

  async fillNewPassword(val: string) {
    await this.newInput.fill(val);
  }

  async fillConfirmPassword(val: string) {
    await this.confirmInput.fill(val);
  }

  // キャンセルボタンをクリック
  async cancel() {
    await this.cancelButton.click();
  }

  // 3つの入力から保存までを一撃で行うコンボ技
  async changePassword(currentVal: string, newVal: string, confirmVal: string) {
    await this.fillCurrentPassword(currentVal);
    await this.fillNewPassword(newVal);
    await this.fillConfirmPassword(confirmVal);
    await this.saveButton.click(); 
  }

  // 各エラーメッセージの表示判定群
  async isCurrentErrorVisible(): Promise<boolean> {
    return await this.currentError.isVisible();
  }

  async isCurrentWrongErrorVisible(): Promise<boolean> {
    return await this.currentWrongError.isVisible();
  }

  async isNewErrorVisible(): Promise<boolean> {
    return await this.newError.isVisible();
  }

  async isConfirmErrorVisible(): Promise<boolean> {
    return await this.confirmError.isVisible();
  }
}