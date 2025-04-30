# Entask

Entask is a modern, feature-rich desktop productivity app built with Electron, React, and TypeScript. It combines a powerful calendar, a flexible todo/task manager, and a robust tagging system into a single, seamless experience designed to help you organize your schedule, tasks, and priorities with ease.

---

## Features

### 🗓️ Calendar & Scheduling

- **Multi-day calendar view**: Visualize your schedule over multiple days with a smooth, scrollable calendar interface.
- **Drag-and-drop event management**: Quickly create, edit, and reschedule events directly on the calendar.
- **Hour markers and day labels** for precise time management.
- **Tag Blocks**: Visually group events/tasks by tag blocks for context-aware planning.

### ✅ Todo & Task Management

- **Todo List Sidebar**: View and manage your active and completed tasks alongside your calendar.
- **Quick Completion**: Mark tasks as done with a single click, or un-complete them just as easily.
- **Recurring and one-off tasks**: Flexible support for all your task types.
- **Due dates, durations, and descriptions**: Capture all the details you need.

### 🏷️ Tagging System

- **Custom Tags**: Create and assign colorful tags to tasks, events, and tag blocks for powerful filtering and organization.
- **Tag Blocks**: Block out time on your calendar for a tag (e.g., "Deep Work"), and visually group related items.
- **Dynamic Tag Management**: Add, remove, and edit tags on the fly.

### 🖥️ Desktop Experience (Electron)

- **Native desktop app**: Runs on Windows, Mac, and Linux via Electron.
- **Keyboard Shortcuts**: Power-user hotkeys for ultra-fast workflow:
  - `Ctrl + N` or `Ctrl + T`: Create a new Task
  - `Ctrl + E`: Create a new Event
  - `Ctrl + B`: Create a new Tag Block
- **Auto-save and persistent storage**: Your data is saved locally and loaded automatically.

### 🛠️ Customization & Extensibility

- **Modern UI**: Built with React, TailwindCSS, and Framer Motion for a beautiful, responsive interface.
- **Component-based architecture**: Easily extend or modify core functionality.

### ⚡ Additional Highlights

- **Updater**: Background updater component keeps your app state and UI in sync.
- **Dialog-driven creation and editing**: Intuitive modal dialogs for adding and editing tasks, events, and tag blocks.
- **Seamless integration between calendar and todo list**: Everything stays in sync.
- **Robust data management**: JSON-based storage for easy backup and migration.
- **Tested with Jest and Testing Library**: Ensures reliability and code quality.

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app in development mode**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

## Project Structure

- `src/`
  - `App.tsx` — Main app entry point
  - `components/` — UI components (Calendar, TodoList, Dialogs, etc.)
  - `classes/` — Core logic for Calendar, Data Management, Tasks, Events, Tags
  - `store/` — State management (Zustand)
  - `electron/` — Electron main process files
  - `database/` — Local JSON data storage

## Tech Stack

- **Electron** (desktop app framework)
- **React** (UI)
- **TypeScript** (type safety)
- **TailwindCSS** (styling)
- **Framer Motion** (animations)
- **Zustand** (state management)
- **Jest** (testing)

## Contributing

Pull requests and suggestions are welcome! Please open an issue first to discuss major changes.

---

## License

MIT

---
