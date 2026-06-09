import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NotificationPage } from '../pages/NotificationPage';
import { PasswordPage } from '../pages/PasswordPage';

test.describe('③POM新規作成課題', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
  });

  // ════════════════════════════════════════════
  // 課題3-1: 通知設定ページ
  // ════════════════════════════════════════════
  test('通知トグルの初期状態を確認し、変更・保存・リセットできる', async ({ page }) => {
    // Arrange: ページ遷移（POM側の新navigateが呼び出されます）
    const notificationPage = new NotificationPage(page);
    await notificationPage.navigate();
    
    // Assert: 初期状態を確認する
    await expect(notificationPage.notifAssign).toBeChecked();        // ON(true)
    await expect(notificationPage.notifDue).toBeChecked();           // ON(true)
    await expect(notificationPage.notifComment).not.toBeChecked();   // OFF(false)
    await expect(notificationPage.notifMention).toBeChecked();       // ON(true)
    await expect(notificationPage.notifWeekly).not.toBeChecked();    // OFF(false)
    
    // Act: トグルをONにして保存
    await notificationPage.toggle(notificationPage.notifComment, true);
    await notificationPage.save();
    
    // Assert: トーストの出現確認
    await expect(page.getByRole('status')).toContainText('通知設定を保存しました');
    
    // Act: リセットボタンをクリック
    await notificationPage.reset();
    
    // Assert: 再びOFFになっていることを確認
    await expect(notificationPage.notifComment).not.toBeChecked();
  });

  // ════════════════════════════════════════════
  // 課題3-2: パスワード変更成功
  // ════════════════════════════════════════════
  test('正しい情報を入力してパスワードを変更できる', async ({ page }) => {
    // Arrange: ページ遷移
    const passwordPage = new PasswordPage(page);
    await passwordPage.navigate();
    
    // Act: パスワード変更コンボ技を発動
    await passwordPage.changePassword('password', 'newPassword1', 'newPassword1');
    
    // Assert: トーストの出現確認
    await expect(page.getByText('パスワードを変更しました')).toBeVisible();
    
    // Assert: 入力フィールドがクリアされていることを検証
    await expect(passwordPage.currentInput).toHaveValue('');
    await expect(passwordPage.newInput).toHaveValue('');
    await expect(passwordPage.confirmInput).toHaveValue('');
  });

  // ════════════════════════════════════════════
  // 課題3-3: パスワード変更バリデーション
  // ════════════════════════════════════════════
  test('パスワード変更のバリデーションエラーが正しく表示される', async ({ page }) => {
    // Arrange: ページ遷移
    const passwordPage = new PasswordPage(page);
    await passwordPage.navigate();
    await passwordPage.changePassword('wrongpass', 'newPassword1', 'newPassword1');
    await expect(passwordPage.currentWrongError).toBeVisible();
    expect(await passwordPage.isCurrentWrongErrorVisible()).toBe(true);
    await passwordPage.cancel();
    await expect(passwordPage.currentInput).toHaveValue('');
    
    // Act: 短すぎるパスワードを入力して保存
    await passwordPage.fillCurrentPassword('password');
    await passwordPage.fillNewPassword('abc');
    await passwordPage.saveButton.click();
    
    // Assert: 短すぎるエラーが表示されたか検証
    await expect(passwordPage.newError).toBeVisible();
    expect(await passwordPage.isNewErrorVisible()).toBe(true);
  });

});