import { test, expect, _electron as electron } from "@playwright/test";
import eph from 'electron-playwright-helpers';


test("creating a task", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  await window.click("#create-new-btn");
  await window.fill("#name", "Playwright Test Task");
  await window.fill("#description", "Created by Playwright system test");

  const createBtn = window.getByTestId("create-btn");
  await expect(createBtn).toBeVisible();
  await expect(createBtn).toBeEnabled();
  await createBtn.click({ force: true });

  await expect(window.locator("text=Playwright Test Task")).toBeVisible();

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

  await window.fill("#name", "Playwright Test Task (edited)");
  await window.fill("#description", "Edited by Playwright system test");

  const saveBtn = await window.getByTestId("save-btn");
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click({ force: true });

  await expect(window.locator("text=Playwright Test Task")).toBeVisible();

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

  const deleteBtn = await window.getByTestId("delete-btn");
  await expect(deleteBtn).toBeVisible();
  await expect(deleteBtn).toBeEnabled();
  await deleteBtn.click({ force: true });

  await expect(window.locator("text=Playwright Test Task (edited)")).not.toBeVisible();

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
