'use client';

import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { ToDo } from './todos';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TodoRowProps = {
  todo: ToDo;
  editingId: number | null;
  draftName: string;
  setDraftName: (name: string) => void;
  draftTags: string
  setDraftTags: (tags: string) => void;
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
  draftName,
  setDraftName,
  draftTags,
  setDraftTags,
  onStartEditing,
  onStopEditing,
  onUpdateName,
  onUpdateTags,
  onChangeDueDate,
  onComplete,
  onDelete
}: TodoRowProps) {
  const isEditing = editingId === todo.id;
  const [nameValue, setNameValue] = useState(todo.name);
  const [tagsValue, setTagsValue] = useState(todo.tags?.join(', ') || '');
  const nameRef = useRef<HTMLInputElement>(null);

  // Reset local editing state and focus when entering editing mode
  useEffect(() => {
  if (isEditing) {
    setNameValue(prev => prev !== todo.name ? todo.name : prev);
    setTagsValue(prev => prev !== (todo.tags?.join(', ') || '') ? (todo.tags?.join(', ') || '') : prev);
    setTimeout(() => {
      nameRef.current?.focus();
    }, 0);
  }
}, [isEditing]);

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
            value={draftName}
            placeholder='New Task'
            onChange={e => setDraftName(e.target.value)}
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
            value={draftTags}
            placeholder="e.g. work, urgent"
            onChange={e => setDraftTags(e.target.value)}
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
          <button className="todo-button" onClick={() => onStartEditing(todo.id)} style={{visibility: todo.archived ? "hidden" : "visible"}}>
            Edit
          </button>
        )}
        <button className="todo-button complete" onClick={() => onComplete(todo.id)} style={{visibility: todo.archived ? "hidden" : "visible"}}>
          Complete
        </button>
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
  const [draftName, setDraftName] = useState<string>('');
  const [draftTags, setDraftTags] = useState<string>('');

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
      setDraftName("");
      setDraftTags("");
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

  function startEditing(id: number) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setDraftName(todo.name);
    setDraftTags(todo.tags?.join(', ') || '');
    setEditingId(id);
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
              onStartEditing={startEditing}
              onStopEditing={() => setEditingId(null)}
              onUpdateName={updateTodoName}
              onUpdateTags={updateTodoTags}
              onChangeDueDate={changeDueDate}
              onComplete={completeTodo}
              onDelete={deleteTodo}
              draftName={draftName}
              draftTags={draftTags}
              setDraftName={setDraftName}
              setDraftTags={setDraftTags}
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