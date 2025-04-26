import { test, expect, _electron as electron } from "@playwright/test";
import eph from 'electron-playwright-helpers';

// E2E create + file-persistence test against the packaged app
	test("creating a task", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  // Open and fill the new-task dialog
  await window.click("#create-new-btn");
  await window.fill("#name", "Playwright Test Task");
  await window.fill("#description", "Created by Playwright system test");

  // Click Create
  const createBtn = window.getByTestId("create-btn");
  await expect(createBtn).toBeVisible();
  await expect(createBtn).toBeEnabled();
  await createBtn.click({ force: true });

  // Confirm UI
  await expect(window.locator("text=Playwright Test Task")).toBeVisible();

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "loadCalendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };
  const found = (calendar as CalendarShape).active.concat((calendar as CalendarShape).completed)
    .find((item) => item.name === "Playwright Test Task" && item.description === "Created by Playwright system test");
  expect(found).toBeTruthy();

  await electronApp.close();
});