import { test, expect, _electron as electron } from "@playwright/test";
import eph from 'electron-playwright-helpers';

// empty the calendar using save-calendar ipc before test suite
test.beforeAll(async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  await eph.ipcMainInvokeHandler(electronApp, "save-calendar", "Calendar");
  await electronApp.close();
})

test("creating an event", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  await window.click("#create-new-btn");
  await window.getByTestId("event-menu-btn").click();
  await window.screenshot({ path: "test-results/event/01-open-new-event-dialog.png" });
  await window.fill("#name", "Playwright Test Event");
  await window.fill("#description", "Created by Playwright system test");
  await window.screenshot({ path: "test-results/event/02-filled-event-fields.png" });

  const createBtn = window.getByTestId("create-btn");
  await expect(createBtn).toBeVisible();
  await expect(createBtn).toBeEnabled();
  await createBtn.click({ force: true });
  await window.screenshot({ path: "test-results/event/03-event-created.png" });

  await expect(window.locator("text=Playwright Test Event")).toBeVisible();
  await window.screenshot({ path: "test-results/event/04-event-visible-in-ui.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };
  const found = (calendar as CalendarShape).active.concat((calendar as CalendarShape).completed)
    .find((item) => item.name === "Playwright Test Event" && item.description === "Created by Playwright system test");
  expect(found).toBeTruthy();

  await electronApp.close();
});

test("editing an event", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  const editEvent = await window.locator("text=Playwright Test Event");
  await expect(editEvent).toBeVisible();
  await editEvent.click();
  await window.screenshot({ path: "test-results/event/05-open-edit-dialog.png" });

  await window.fill("#name", "Playwright Test Event (edited)");
  await window.fill("#description", "Edited by Playwright system test");
  await window.screenshot({ path: "test-results/event/06-edited-event-fields.png" });

  const saveBtn = await window.getByTestId("save-btn");
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click({ force: true });
  await window.screenshot({ path: "test-results/event/07-after-save-edit.png" });

  await expect(window.locator("text=Playwright Test Event (edited)")).toBeVisible();
  await window.screenshot({ path: "test-results/event/08-edited-event-visible-in-ui.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };
  const found = (calendar as CalendarShape).active.concat((calendar as CalendarShape).completed)
    .find((item) => item.name === "Playwright Test Event (edited)" && item.description === "Edited by Playwright system test");
  expect(found).toBeTruthy();

  await electronApp.close();
});

test("deleting an event", async () => {
  const electronApp = await electron.launch({ args: ["dist-electron/main.js"] });
  const window = await electronApp.firstWindow();

  const editEvent = await window.locator("text=Playwright Test Event (edited)");
  await expect(editEvent).toBeVisible();
  await editEvent.click();
  await window.screenshot({ path: "test-results/event/09-open-edit-dialog-for-delete.png" });

  const deleteBtn = await window.getByTestId("delete-btn");
  await expect(deleteBtn).toBeVisible();
  await expect(deleteBtn).toBeEnabled();
  await deleteBtn.click({ force: true });
  await window.screenshot({ path: "test-results/event/10-after-delete.png" });

  await expect(window.locator("text=Playwright Test Event (edited)")).not.toBeVisible();
  await window.screenshot({ path: "test-results/event/11-event-not-visible-after-delete.png" });

  // wait for debounce
  await window.waitForTimeout(1000);

  const calendar = await eph.ipcMainInvokeHandler(electronApp, "load-calendar", "Calendar");
    
  type CalendarShape = {
    active: Array<{ name: string; description: string }>;
    completed: Array<{ name: string; description: string }>;
  };

  // check that calendar completed and active are empty
  const calendarShape = calendar as CalendarShape;
  expect(calendarShape.active).toEqual([]);
  expect(calendarShape.completed).toEqual([]);

  await electronApp.close();
});
