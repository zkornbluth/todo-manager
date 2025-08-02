# To Do Manager

Check it out here: [zkornbluth.github.io/todo-manager](https://zkornbluth.github.io/todo-manager)

## Getting Started

If you want to set this up locally, follow the instructions below.

### 1. Ensure you have the following installed:
* Git
* node.js
* npm (Node Package Manager)

### 2. Clone the repository
```bash
git clone https://github.com/zkornbluth/todo-manager.git
cd todo-manager
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run
```bash
npm run dev
```

Your console should display a URL that looks like this: [https://localhost:3000](https://localhost:3000). Copy and paste that URL into a browser. 
Don't use the link here as your port may be different.

## Using the To Do Manager

Add a task by clicking the "+" button. You'll be able to set a name, tags (tasks can have multiple tags), and due date (defaults to today). Click "Save" or press the Enter key to save.
<img width="1470" height="919" alt="todo-1" src="https://github.com/user-attachments/assets/faa5a5f6-bda3-4536-a133-fb97b3d157d7" />

Edit a task's name and tags by clicking the "Edit" button. Click "Save" or press the Enter key to save.
<img width="1470" height="919" alt="todo-2" src="https://github.com/user-attachments/assets/c0ad6e63-4ea9-4fdd-a7c7-656ded240737" />

Due date is editable without clicking Edit - just click the date itself and you'll be able to pick a new due date on the calendar.
<img width="1470" height="919" alt="todo-3" src="https://github.com/user-attachments/assets/b3d70d51-747a-4c9c-b228-337cfdc448a9" />

Clicking "Complete" removes the task from the active list, but it remains viewable if you click the "View Completed Tasks" checkbox.
<img width="1470" height="919" alt="todo-4" src="https://github.com/user-attachments/assets/2039c7f3-bb6f-4bfd-bbae-813c44ae297e" />

Inputting a tag name in the "Filter by tag" field shows only the tasks containing that tag.
<img width="1470" height="919" alt="todo-5" src="https://github.com/user-attachments/assets/7a2e29c7-0328-41b7-9e26-4adac3f59793" />

Clicking "Delete" removes the task forever.

Tasks persist in local storage even if the server shuts down and restarts.

<a href="https://www.flaticon.com/free-icons/do" title="do icons">Tab icon created by HideMaru - Flaticon</a>
