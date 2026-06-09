import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
// TODO: 作成したPOMをインポートする
import { NotificationPage } from '../pages/NotificationPage';
import { PasswordPage } from '../pages/PasswordPage';

test.describe('③POM新規作成課題', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
  });

  // ════════════════════════════════════════════
  // 課題3-1: 通知設定ページ（NotificationPage を新規作成して使う）
  // 作成するファイル: pages/NotificationPage.ts
  // 参考: LoginPage.ts の構造を真似て作成すること
  //
  // 注意: トグルの <input type="checkbox"> は CSS で非表示になっています。
  // クリックには locator.evaluate(el => el.click()) を使ってください。
  //
  // 必要なPOM要素:
  //   Locator: notifAssign, notifDue, notifComment, notifMention, notifWeekly,
  //            saveButton, resetButton
  //   メソッド: navigate(), toggle(), save(), reset(), isChecked()
  // ════════════════════════════════════════════
  // ※ test.fixme() はテストを「未実装」としてスキップする機能です。
  //   実装が完了したら test.fixme → test に書き換えてテストを有効にしてください。

  test('通知トグルの初期状態を確認し、変更・保存・リセットできる', async ({ page }) => {
    // TODO: NotificationPage を new して navigate() で通知設定ページに遷移する

    // TODO: 初期状態を確認する（5つのトグルlocatorを全て使用）
    // notif-assign: ON(true)
    // notif-due: ON(true)
    // notif-comment: OFF(false)
    // notif-mention: ON(true)
    // notif-weekly: OFF(false)

    // TODO: notif-comment トグルをONにして保存する
    // トーストに「通知設定を保存しました」が表示されることを確認する
    // ヒント: page.getByRole('status') でトースト要素を取得できる

    // TODO: リセットボタンをクリックする
    // notif-comment が再びOFF(false)になっていることを確認する

      // Arrange: NotificationPage を new して navigate() で通知設定ページに遷移する
      const notificationPage = new NotificationPage(page);
      await notificationPage.navigate();
    
      // 🎯 TODO: 初期状態を確認する（5つのトグルlocatorを全て使用）
      // 💡 Playwrightの標準技 .toBeChecked() と .not.toBeChecked() で、
      // 隠しチェックボックスの状態を1行ずつ確実に答え合わせします。
      await expect(notificationPage.notifAssign).toBeChecked();        // ON(true)
      await expect(notificationPage.notifDue).toBeChecked();           // ON(true)
      await expect(notificationPage.notifComment).not.toBeChecked();   // OFF(false)
      await expect(notificationPage.notifMention).toBeChecked();       // ON(true)
      await expect(notificationPage.notifWeekly).not.toBeChecked();    // OFF(false)
    
      // 🚀 TODO: notif-comment トグルをONにして保存する
      // 💡 画面上は見えないトグルなので、POMで自作した evaluate 発動の `toggle` 技を繰り出します！
      await notificationPage.toggle(notificationPage.notifComment, true);
      await notificationPage.save();
    
      // 🎯 トーストに「通知設定を保存しました」が表示されることを確認する
      // 💡 ヒントの通り getByRole('status') を使い、文字が含まれているかを検証します
      await expect(page.getByRole('status')).toContainText('通知設定を保存しました');
    
      // 🛠️ TODO: リセットボタンをクリックする
      await notificationPage.reset();
    
      // 🎯 notif-comment が再びOFF(false)になっていることを確認する
      await expect(notificationPage.notifComment).not.toBeChecked();

  });

  // ════════════════════════════════════════════
  // 課題3-2: パスワード変更成功（PasswordPage を新規作成して使う）
  // 作成するファイル: pages/PasswordPage.ts
  //
  // 必要なPOM要素:
  //   Locator: currentInput, newInput, confirmInput, saveButton, cancelButton,
  //            currentError, currentWrongError, newError, confirmError
  //   メソッド: navigate(), changePassword(), fillCurrentPassword(),
  //            fillNewPassword(), fillConfirmPassword(), cancel(),
  //            isCurrentErrorVisible(), isCurrentWrongErrorVisible(),
  //            isNewErrorVisible(), isConfirmErrorVisible()
  // ════════════════════════════════════════════
  test('正しい情報を入力してパスワードを変更できる', async ({ page }) => {
    // TODO: PasswordPage を new して navigate() でパスワード変更ページに遷移する

    // TODO: changePassword('password', 'newPassword1', 'newPassword1') を呼び出す
    // トーストに「パスワードを変更しました」が表示されることを確認する

    // TODO: 変更後、入力フィールドがクリアされていることを確認する
    // currentInput, newInput, confirmInput がそれぞれ空であること

      // 🧱 Arrange: PasswordPage を new して navigate() でパスワード変更ページに遷移する
      const passwordPage = new PasswordPage(page);
      await passwordPage.navigate();
    
      // 🚀 Act: changePassword('password', 'newPassword1', 'newPassword1') を呼び出す
      // 💡 あなたが仕込んだ3つの fill とボタンクリックを一撃で終わらせるコンボ技がここで炸裂します！
      await passwordPage.changePassword('password', 'newPassword1', 'newPassword1');
    
      // 🎯 Assert: トーストに「パスワードを変更しました」が表示されることを確認する
      // 💡 これまでの傾向に合わせて、一番確実に文字を捕まえられる getByText で待ち構えます
      await expect(page.getByText('パスワードを変更しました')).toBeVisible();
    
      // 🎯 Assert: 変更後、入力フィールドがクリアされていることを確認する
      // currentInput, newInput, confirmInput がそれぞれ空（''）であることを検証
      await expect(passwordPage.currentInput).toHaveValue('');
      await expect(passwordPage.newInput).toHaveValue('');
      await expect(passwordPage.confirmInput).toHaveValue('');


  });

  // ════════════════════════════════════════════
  // 課題3-3: パスワード変更バリデーション
  // ════════════════════════════════════════════
  test('パスワード変更のバリデーションエラーが正しく表示される', async ({ page }) => {
    // TODO: PasswordPage を new して navigate() でパスワード変更ページに遷移する

    // TODO: 現在のパスワードが間違っている場合のエラーを確認する
    // changePassword('wrongpass', 'newPassword1', 'newPassword1') を呼び出す
    // isCurrentWrongErrorVisible() が true であることを確認する

    // TODO: cancel() でフィールドをクリアする
    // currentInput が空になっていることを確認する

    // TODO: 新しいパスワードが短すぎる場合のエラーを確認する
    // fillCurrentPassword('password') を呼び出す
    // fillNewPassword('abc') を呼び出す
    // 保存ボタンをクリックする
    // isNewErrorVisible() が true であることを確認する

      // 🧱 TODO: PasswordPage を new して navigate() でパスワード変更ページに遷移する
      const passwordPage = new PasswordPage(page);
      await passwordPage.navigate();
    
      // ❌ TODO: 現在のパスワードが間違っている場合のエラーを確認する
      // changePassword('wrongpass', 'newPassword1', 'newPassword1') を呼び出す
      await passwordPage.changePassword('wrongpass', 'newPassword1', 'newPassword1');
      
      // 🎯 isCurrentWrongErrorVisible() が true であることを確認する
      // 💡 技ありポイント：直前の toBeVisible でエラーが出るのを数秒「自動待機」させてから、
      // お題の指定メソッドを使って「.toBe(true)」の答え合わせをすると絶対に落ちない頑丈なテストになります！
      await expect(passwordPage.currentWrongError).toBeVisible();
      expect(await passwordPage.isCurrentWrongErrorVisible()).toBe(true);
    
      // 🧹 TODO: cancel() でフィールドをクリアする
      await passwordPage.cancel();
      
      // 🎯 currentInput が空（''）になっていることを確認する
      await expect(passwordPage.currentInput).toHaveValue('');
    
      // ⚠️ TODO: 新しいパスワードが短すぎる場合のエラーを確認する
      // fillCurrentPassword('password') を呼び出す
      await passwordPage.fillCurrentPassword('password');
      
      // fillNewPassword('abc') を呼び出す
      await passwordPage.fillNewPassword('abc');
      
      // 保存ボタンをクリックする（POMのsaveButtonプロパティを使用）
      await passwordPage.saveButton.click();
      
      // 🎯 isNewErrorVisible() が true であることを確認する
      await expect(passwordPage.newError).toBeVisible(); // 出現を待つ安全弁
      expect(await passwordPage.isNewErrorVisible()).toBe(true);
    });

  });