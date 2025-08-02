import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { ToDo } from './todos';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

export default function TodoRow({
  todo,
  editingId,
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

  useEffect(() => {
    if (isEditing) {
      setNameValue(todo.name);
      setTagsValue(todo.tags?.join(', ') || '');
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

  function handleDateChange(date: Date) {
    if (isEditing) {
      onUpdateName(todo.id, nameValue.trim());
      onUpdateTags(
        todo.id,
        tagsValue
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== '')
      );
    }

    onChangeDueDate(todo.id, date);
  }

  function styleDueDate(date: Date, archived: boolean): string { // Add class to due date if due today (orange) or overdue (red)
    let dateClass = "compact-datepicker";
    if (archived) return dateClass;

    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() < today.getTime()) {
      dateClass += " overdue";
    } else if (due.getTime() === today.getTime()) {
      dateClass += " due-today"
    }
    return dateClass
  }

  return (
    <tr>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <input
            ref={nameRef}
            value={nameValue}
            placeholder='New Task'
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
          className={styleDueDate(new Date(todo.dueDate), todo.archived)}
          selected={new Date(todo.dueDate)}
          onChange={handleDateChange}
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