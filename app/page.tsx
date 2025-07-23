'use client';

import React, { useState, useEffect } from 'react';
import './styles.css';
import { ToDo } from './todos';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Header({ title }: { title?: string }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

type TodoRowProps = {
  todo: ToDo;
  editingId: number | null;
  onStartEditing: (id: number) => void;
  onStopEditing: () => void;
  onUpdateName: (id: number, name: string) => void;
  onUpdateTags: (id: number, tags: string[]) => void;
  onChangeDueDate: (id: number, date: Date) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
};

function TodoRow({
  todo,
  editingId,
  onStartEditing,
  onStopEditing,
  onUpdateName,
  onUpdateTags,
  onChangeDueDate,
  onComplete,
  onDelete,
}: TodoRowProps) {
  const isEditing = editingId === todo.id;
  const [nameValue, setNameValue] = React.useState(todo.name);
  const [tagsValue, setTagsValue] = React.useState(todo.tags?.join(', ') || '');
  const nameRef = React.useRef<HTMLInputElement>(null);

  // Reset local editing state and focus when entering editing mode
  React.useEffect(() => {
    if (isEditing) {
      setNameValue(todo.name);
      setTagsValue(todo.tags?.join(', ') || '');
      setTimeout(() => {
        nameRef.current?.focus();
      }, 0);
    }
  }, [isEditing, todo.name, todo.tags]);

  function handleSave() {
    onUpdateName(todo.id, nameValue.trim());
    onUpdateTags(
      todo.id,
      tagsValue
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
    );
    onStopEditing();
  }

  return (
    <tr>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <input
            ref={nameRef}
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        ) : (
          todo.name || 'Untitled'
        )}
      </td>
      <td>
        <DatePicker
          className="compact-datepicker"
          selected={new Date(todo.dueDate)}
          onChange={(date: Date) => onChangeDueDate(todo.id, date)}
          dateFormat="MMM d, yyyy"
        />
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={tagsValue}
            placeholder="e.g. work, urgent"
            onChange={e => setTagsValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        ) : todo.tags && todo.tags.length > 0 ? (
          todo.tags.join(', ')
        ) : (
          <i style={{ color: '#aaa' }}>No tags</i>
        )}
      </td>
      <td>
        {isEditing ? (
          <button className="todo-button save" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="todo-button" onClick={() => onStartEditing(todo.id)}>
            Edit
          </button>
        )}
        {!todo.archived && (
          <button className="todo-button complete" onClick={() => onComplete(todo.id)}>
            Complete
          </button>
        )}
        <button className="todo-button delete" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function HomePage() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [idCount, setIdCount] = useState<number>(0);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');

  function newToDo(): void {
    const today = new Date();
    const newTodoId = idCount;

    const newTD: ToDo = new ToDo(newTodoId, "New Task", today);
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

  function RenderToDos() {
    const activeTodos = viewArchived
      ? todos.filter(todo => todo.archived)
      : todos.filter(todo => !todo.archived);

    const filteredTodos = filterTag
      ? activeTodos.filter(todo =>
          todo.tags?.some(tag =>
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      : activeTodos;

    return (
      <table className="todo-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
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
      <Header title="To Do List" />
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