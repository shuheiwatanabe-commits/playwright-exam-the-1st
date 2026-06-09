import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';   // 👈 LoginPageをインポート
import { ReportPage } from '../pages/ReportPage';   // 👈 ReportPageをインポート

test.describe('①レポート機能の課題', () => {

  // 🔐【超重要】すべてのテストが始まる前に、自動でログインを実行する安全弁
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();          // 💡 ここで真っ白な画面からログイン画面に変身します！
    await login.loginAsAdmin();  // 💡 管理者としてログインを実行！
  });

  // ────────────────────────────────────────────
  // 課題1-1: 担当者フィルター
  // ────────────────────────────────────────────
  test('担当者「田中」で絞り込むとテーブルが2件になる', async ({ page }) => {
    //Arrange
    const reportPage = new ReportPage(page);
    await reportPage.navigate(); // 💡 ログイン後なので、無事にレポートページへ遷移できます！
    // Act
    await reportPage.clearDateFilter();
    await reportPage.filterByAssignee('田中');
    //Assert
    const rowCount = await reportPage.getReportRowCount();
    expect(rowCount).toBe(2);
  });

  // ────────────────────────────────────────────
  // 課題1-2: 集計カードの件数
  // ────────────────────────────────────────────
  test('集計カードの「総タスク数」がテーブルの行数と一致する', async ({ page }) => {
    //Arrange
    const reportPage = new ReportPage(page);
    await reportPage.navigate();
    //Act
    await reportPage.clearDateFilter();
    //Asert
    const statValues = await reportPage.getStatValues();
    const rowCount = await reportPage.getReportRowCount();
    expect(statValues[0]).toBe(rowCount);
  });

  // ────────────────────────────────────────────
  // 課題1-3: エクスポートボタン
  // ────────────────────────────────────────────
  test('エクスポートボタンをクリックするとトーストが表示される', async ({ page }) => {
    //Arrange
    const reportPage = new ReportPage(page);
    await reportPage.navigate();
    //Act
    await reportPage.exportReport();
    //Assert
    await expect(page.getByRole('status')).toContainText('エクスポートしました（CSV）');
  });

});