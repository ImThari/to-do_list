import { useState } from "react";
import PropTypes from 'prop-types';
import EditIcon from "../assets/edit.svg";
import RemoveIcon from "../assets/trash-2.svg";
import CheckIcon from "../assets/check.svg";
import XIcon from "../assets/x.svg";
import "../styles/Task.css";

function Task({ task, removeTask, updateTask, toggleCompleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(task.name);
    const [editedDate, setEditedDate] = useState(task.dueDate);
  
    const handleUpdate = () => {
      updateTask(task.id, editedName, editedDate);
      setIsEditing(false);
    };
  
    if (isEditing) {
      return (
        <tr>
          <td><input className="todo-input" value={editedName} onChange={(e) => setEditedName(e.target.value)} /></td>
          <td><input className="todo-input" type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} /></td>
          <td className="icon-cell">
            <img src={CheckIcon} alt="Save" onClick={handleUpdate} />
            <img src={XIcon} alt="Cancel" onClick={() => setIsEditing(false)} />
          </td>
          <td colSpan="2"></td>
        </tr>
      );
    }
    
      return (
        <tr>
          <td>{task.name}</td>
          <td>{task.dueDate}</td>
          <td className="icon-cell"><img src={EditIcon} alt="Edit" onClick={() => setIsEditing(true)} /></td>
          <td className="icon-cell">
            <input type="checkbox" checked={task.isCompleted} onChange={() => toggleCompleted(task.id)} className="rounded-checkbox" />
          </td>
          <td className="icon-cell"><img src={RemoveIcon} alt="Delete" onClick={() => removeTask(task.id)} /></td>
        </tr>
      );
    
    }
    
Task.propTypes = {
    task: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool.isRequired,
      dueDate: PropTypes.string,
    }).isRequired,
    removeTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    toggleCompleted: PropTypes.func.isRequired,
};

export default Task;
