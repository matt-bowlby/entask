import { test, expect, _electron as electron } from "@playwright/test";

test("create a new task", async () => {
    const electronApp = await electron.launch({
        args: ["dist-electron/main.js"],
    });

    const window = await electronApp.firstWindow();

    await window.click('#create-new-btn');
    // Fill in the task title and description using actual input IDs
    await window.fill('#name', 'Playwright Test Task');
    await window.fill('#description', 'Created by Playwright E2E test');

    // Click the 'Save' button (update selector if needed)
    await window.getByRole('button', { name: /save/i }).click();

    // Assert the new task appears in the task list
    await expect(window.locator('text=Playwright Test Task')).toBeVisible();

    await electronApp.close();
});