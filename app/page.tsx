'use client';

import React, { useState, useEffect } from 'react';
import './styles.css';
import { ToDo } from './todos';
import TodoRow from './todorow';



export default function HomePage() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [idCount, setIdCount] = useState<number>(0);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');
  const [dueDateMode, setDueDateMode] = useState<number>(0);
  const [taskNameMode, setTaskNameMode] = useState<number>(0);

  function newToDo(): void {
    const today = new Date();
    const newTodoId = idCount;

    const newTD: ToDo = new ToDo(newTodoId, "", today);
    newTD.tags = [];

    setTodos(prevTodos => [...prevTodos, newTD]);
    setIdCount(prev => prev + 1);

    // Start editing the new todo after it’s added
    setTimeout(() => {
      setEditingId(newTodoId);
    }, 0);
  }

  function updateTodoName(id: number, newName: string) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, name: newName } : todo
      )
    );
  }

  function updateTodoTags(id: number, newTags: string[]) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, tags: newTags } : todo
      )
    );
  }

  function changeDueDate(id: number, newDate: Date) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, dueDate: newDate } : todo
      )
    );
  }

  function completeTodo(todoId: number) {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, archived: true } : todo
    ));
  }

  function deleteTodo(todoId: number) {
    setTodos(todos.filter(todo => todo.id !== todoId));
  }

  function changeDueDateHeader(): string {
    switch (dueDateMode) {
      case 0:
        return "Due Date"
      case 1:
        return "Due Date ↑"
      case 2:
        return "Due Date ↓"
    }
  }

  function onDueDateSort() {
    setTaskNameMode(0);
    if (dueDateMode == 2) {
      setDueDateMode(0);
    } else {
      setDueDateMode(dueDateMode + 1);
    }
  }

  function changeTaskNameHeader(): string {
    switch (taskNameMode) {
      case 0:
        return "Task"
      case 1:
        return "Task ↑"
      case 2:
        return "Task ↓"
    }
  }

  function onTaskNameSort() {
    setDueDateMode(0);
    if (taskNameMode == 2) {
      setTaskNameMode(0);
    } else {
      setTaskNameMode(taskNameMode + 1);
    }
  }

  function sortByDueDate(direction: 'asc' | 'desc') {
    return function(a: ToDo, b: ToDo): number {
      const adate = new Date(a.dueDate);
      adate.setHours(0, 0, 0, 0);
      const bdate = new Date(b.dueDate);
      bdate.setHours(0, 0, 0, 0);

      const diff = adate.getTime() - bdate.getTime();

      return direction === 'asc' ? diff : -diff;
    };
  }

  function RenderToDos() {
    const activeTodos = viewArchived
      ? todos
      : todos.filter(todo => !todo.archived);

    const filteredTodos = filterTag
      ? activeTodos.filter(todo =>
          todo.tags?.some(tag =>
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      : activeTodos;

    if (dueDateMode == 1) {
      filteredTodos.sort(sortByDueDate('asc'));
    } else if (dueDateMode == 2) {
      filteredTodos.sort(sortByDueDate('desc'));
    }

    if (taskNameMode == 1) {
      filteredTodos.sort((a, b) => a.name > b.name ? 1 : -1);
    } else if (taskNameMode == 2) {
      filteredTodos.sort((a, b) => a.name < b.name ? 1 : -1);
    }

    return (
      <table className="todo-table">
        <thead>
          <tr>
            <th>
              <button className='table-header-button' onClick={onTaskNameSort}>{changeTaskNameHeader()}</button>
            </th>
            <th>
              <button className="table-header-button" onClick={onDueDateSort}>{changeDueDateHeader()}</button>
            </th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              editingId={editingId}
              onStartEditing={setEditingId}
              onStopEditing={() => setEditingId(null)}
              onUpdateName={updateTodoName}
              onUpdateTags={updateTodoTags}
              onChangeDueDate={changeDueDate}
              onComplete={completeTodo}
              onDelete={deleteTodo}
            />
          ))}
        </tbody>
      </table>
    );
  }

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      const parsed: ToDo[] = JSON.parse(stored);
      setTodos(parsed);

      const maxId = parsed.reduce((max, todo) => Math.max(max, todo.id), 0);
      setIdCount(maxId + 1);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    if (!todos.some(t => t.id === editingId)) {
      setEditingId(null);
    }
  }, [todos]);

  return (
    <div>
      <h1>To Do List</h1>
      <br />
      <label htmlFor="filterInput" id="tags-filter">Filter by tag:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className='filter-input'
      />
      <label htmlFor="viewArchivedTodos">
        View Completed Tasks
      </label>
      <input
        type="checkbox"
        id="viewArchivedTodos"
        checked={viewArchived}
        onChange={() => setViewArchived(!viewArchived)}
      />
      <RenderToDos />
      <br />
      <button className="todo-button" onClick={newToDo}>+</button>
    </div>
  );
}