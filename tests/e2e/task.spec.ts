import { test, expect, _electron as electron } from "@playwright/test";
import eph from 'electron-playwright-helpers';

// empty the calendar using save-calendar ipc before test suite
test.beforeAll(async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  await eph.ipcMainInvokeHandler(electronApp, "save-calendar", "Calendar");
  await electronApp.close();
})

test("creating a task", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  await window.click("#create-new-btn");
  await window.screenshot({ path: "test-results/task/01-open-new-task-dialog.png" });
  await window.fill("#name", "Playwright Test Task");
  await window.fill("#description", "Created by Playwright system test");
  await window.screenshot({ path: "test-results/task/02-filled-task-fields.png" });

  const createBtn = window.getByTestId("create-btn");
  await expect(createBtn).toBeVisible();
  await expect(createBtn).toBeEnabled();
  await createBtn.click({ force: true });
  await window.screenshot({ path: "test-results/task/03-task-created.png" });

  await expect(window.locator("text=Playwright Test Task")).toBeVisible();
  await window.screenshot({ path: "test-results/task/04-task-visible-in-ui.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };
  const found = (calendar as CalendarShape).active.concat((calendar as CalendarShape).completed)
    .find((item) => item.name === "Playwright Test Task" && item.description === "Created by Playwright system test");
  expect(found).toBeTruthy();

  await electronApp.close();
});

test("editing a task", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  const editTask = await window.locator("text=Playwright Test Task");
  await expect(editTask).toBeVisible();
  await editTask.click();
  await window.screenshot({ path: "test-results/task/05-open-edit-dialog.png" });

  await window.fill("#name", "Playwright Test Task (edited)");
  await window.fill("#description", "Edited by Playwright system test");
  await window.screenshot({ path: "test-results/task/06-edited-task-fields.png" });

  const saveBtn = await window.getByTestId("save-btn");
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click({ force: true });
  await window.screenshot({ path: "test-results/task/07-after-save-edit.png" });

  await expect(window.locator("text=Playwright Test Task")).toBeVisible();
  await window.screenshot({ path: "test-results/task/08-edited-task-visible-in-ui.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };
  const found = (calendar as CalendarShape).active.concat((calendar as CalendarShape).completed)
    .find((item) => item.name === "Playwright Test Task (edited)" && item.description === "Edited by Playwright system test");
  expect(found).toBeTruthy();

  await electronApp.close();
});

test("deleting a task", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  const editTask = await window.locator("text=Playwright Test Task (edited)");
  await expect(editTask).toBeVisible();
  await editTask.click();
  await window.screenshot({ path: "test-results/task/09-open-edit-dialog-for-delete.png" });

  const deleteBtn = await window.getByTestId("delete-btn");
  await expect(deleteBtn).toBeVisible();
  await expect(deleteBtn).toBeEnabled();
  await deleteBtn.click({ force: true });
  await window.screenshot({ path: "test-results/task/10-after-delete.png" });

  await expect(window.locator("text=Playwright Test Task (edited)")).not.toBeVisible();
  await window.screenshot({ path: "test-results/task/11-task-not-visible-after-delete.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
		completed: Array<{ name: string; description: string }
		>;
  };

  // check that calendar completed and active are empty
  const calendarShape = calendar as CalendarShape;
  expect(calendarShape.active).toEqual([]);
  expect(calendarShape.completed).toEqual([]);

  await electronApp.close();
});
