import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskPage } from '../pages/TaskPage';
import { TaskModal } from '../pages/TaskModal';

test.describe('②POM編集課題', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
  });

  // ────────────────────────────────────────────
  // 課題2-1: 担当者フィルター・担当者名取得・メモ取得
  // TaskPage に filterByAssignee / getTaskAssignee / getTaskMemo を追加して使う
  //
  // ※ test.fixme() はテストを「未実装」としてスキップする機能です。
  //   実装が完了したら test.fixme → test に書き換えてテストを有効にしてください。
  // ────────────────────────────────────────────
  test('担当者フィルターで「田中」を選択すると絞り込まれ、担当者名・メモが取得できる', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.navigate();

    // 全件数を取得
    const totalCount = await taskPage.getTaskCount();

    // TODO: TaskPage.filterByAssignee('田中') を呼び出す
    await taskPage.filterByAssignee('田中');
    const filteredCount = await taskPage.getTaskCount();
    // TODO: 絞り込み後の件数が全件より少ないことを確認する
    expect(filteredCount).toBeLessThan(totalCount);
    // TODO: TaskPage.getTaskAssignee(1) で担当者名が「田中」であることを確認する
    const assigneeName = await taskPage.getTaskAssignee(1);
    // 🔄 修正前：expect(assigneeName).toBe('田中');
    expect(assigneeName).toBe('担当: 田中'); // 🎯 「担当: 」を付け足す
    // TODO: TaskPage.getTaskMemo(1) でメモに「Node.js 18以上が必要」が含まれることを確認する
    const taskMemo = await taskPage.getTaskMemo(1);
    expect(taskMemo).toContain('Node.js 18以上が必要');
  });

  // ────────────────────────────────────────────
  // 課題2-2: 担当者・メモ・ステータス（レビュー中）を設定してタスク追加
  // TaskModal に selectAssignee / fillMemo を追加し、selectStatus の型に 'review' を追加して使う
  // ────────────────────────────────────────────
  test('担当者・メモ・ステータス（レビュー中）を設定してタスクを追加できる', async ({ page }) => {
    const taskPage  = new TaskPage(page);
    const taskModal = new TaskModal(page);

    await taskPage.addTaskButton.click();
    await taskModal.fillTitle('レビュー確認タスク');

    // TODO: TaskModal.selectStatus('review') を呼び出す（型も修正すること）
    await taskModal.selectStatus('review');
    // TODO: TaskModal.selectAssignee('鈴木') を呼び出す
    await taskModal.selectAssignee('鈴木');
    // TODO: TaskModal.fillMemo('レビュー用メモ') を呼び出す
    await taskModal.fillMemo('レビュー用メモ');
    await taskModal.save();

    // TODO: 追加されたタスクのステータスが「レビュー中」であることを確認する
    const addedStatus = await taskPage.getTaskStatus(7);
    expect(addedStatus).toBe('レビュー中');
    // TODO: 追加されたタスクのメモに「レビュー用メモ」が含まれることを確認する
    // ヒント: 追加後のタスクIDは 7 になる
    const addedMemo = await taskPage.getTaskMemo(7);
    expect(addedMemo).toContain('レビュー用メモ');
  });

  // ────────────────────────────────────────────
  // 課題2-3: 下書き保存（TaskModal に saveDraft を追加して使う）
  // ────────────────────────────────────────────
  test('下書き保存するとステータスが「未着手」でタスクが追加される', async ({ page }) => {
    const taskPage  = new TaskPage(page);
    const taskModal = new TaskModal(page);

    await taskPage.addTaskButton.click();
    await taskModal.fillTitle('下書きタスク');
    await taskModal.selectStatus('doing');

    // TODO: TaskModal.saveDraft() を呼び出す
    // 下書き保存ではステータスが強制的に「未着手」になる仕様
    await taskModal.saveDraft();

    // TODO: 追加されたタスクのステータスが「未着手」であることを確認する
    // ヒント: 追加後のタスクIDは 7 になる
    const addedStatus = await taskPage.getTaskStatus(7);
    expect(addedStatus).toBe('未着手');
  });

});