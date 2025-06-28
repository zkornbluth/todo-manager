'use client';

import React, { useState, useEffect } from 'react';
import './styles.css';
import { ToDo } from './todos'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
 
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}
 
export default function HomePage() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [idCount, setIdCount] = useState<number>(0);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  function newToDo(): void {
    let today: Date = new Date();
    let newTD: ToDo = new ToDo(idCount, "New Task", today);
    setTodos([...todos, newTD]);
    setIdCount(idCount + 1);
    setEditingId(idCount);
  }

  function updateTodoName(id: number, newName: string) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, name: newName } : todo
      )
    );
  }

  function stopEditing() {
    setEditingId(null);
  }

  function EditButton({ todo, hidden = false }) {
  return (
    <button
      className="todo-button"
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      onClick={() => setEditingId(todo.id)}
    >
      Edit
    </button>
  );
}

  function changeDueDate(id: number, newDate: Date) {
    setTodos(prev =>
    prev.map(todo =>
      todo.id === id ? { ...todo, dueDate: newDate } : todo
    )
  );
  }

  function RenderToDos() {
    const activeTodos = viewArchived
    ? todos.filter(todo => todo.archived)
    : todos.filter(todo => !todo.archived);

    return (
      <table className='todo-table'>
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeTodos.map(todo => (
            <tr key={todo.id}>
              {/* Task Name (or editing field) */}
              <td className='todo-td' style={{ textAlign: 'center' }}>
                {editingId === todo.id ? (
                  <input
                    autoFocus
                    value={todo.name}
                    onChange={e => updateTodoName(todo.id, e.target.value)}
                    onBlur={stopEditing}
                    onKeyDown={e => {
                      if (e.key === 'Enter') stopEditing();
                    }}
                  />
                ) : (
                  <>
                  {todo.name || 'Untitled'}
                  </>
                )}
              </td>
              {/* Due Date display + picker */}
              <td className='todo-td'>
                <DatePicker 
                  className='compact-datepicker'
                  selected={new Date(todo.dueDate)} 
                  onChange={(date: Date) => changeDueDate(todo.id, date)} 
                  dateFormat="MMM d, yyyy"
                />
              </td>
              {/* Edit, Complete, Delete buttons */}
              <td className='todo-td'>
                <div>
                  <EditButton todo={todo} hidden={editingId === todo.id} />
                  { !viewArchived && <CompleteButton todo={todo} /> }
                  <DeleteButton todo={todo} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  function deleteTodo(todoId: number) {
    setTodos(todos.filter(todo => todo.id !== todoId));
  }

  function DeleteButton({todo}) {
    return <button className='todo-button delete' onClick={() => deleteTodo(todo.id)}>Delete</button>
  }

  function completeTodo(todoId: number) {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, archived: true } : todo
    ));
  }

  function CompleteButton({todo}) {
    return <button className="todo-button complete" onClick={() => completeTodo(todo.id)}>Complete</button>
  }

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      const parsed: ToDo[] = JSON.parse(stored);
      setTodos(parsed);

      // Set idCount to avoid duplicate IDs
      const maxId = parsed.reduce((max, todo) => Math.max(max, todo.id), 0);
      setIdCount(maxId + 1);
    }
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
 
  return (
    <div>
      <Header title="To Do List" />
 
      <br></br>
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

      <br></br>
      <button className="todo-button" onClick={newToDo}>+</button>

    </div>
  );
}