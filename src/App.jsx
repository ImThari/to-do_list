import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import AddTaskIcon from "./assets/plus.svg";
import EditIcon from "./assets/edit.svg";
import RemoveIcon from "./assets/trash-2.svg";
import StartTimerIcon from "./assets/clock.svg";
import ValidateIcon from "./assets/check.svg";
import XIcon from "./assets/x.svg";

function Task({ task, removeTask, updateTask, toggleCompleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(task.name);
  const [newDueDate, setNewDueDate] = useState(task.dueDate);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    let interval;
    if (isTiming) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const handleUpdate = () => {
    updateTask(task.id, newName, newDueDate);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsTiming(false);
  };

  return (
    <tr className={task.isCompleted ? "completed" : ""}>
      <td>
        {isEditing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </>
        ) : (
          task.name
        )}
      </td>
      <td>{task.dueDate}</td>
      <td>
        {timer > 0 && <span>Elapsed time: {timer} s</span>}
        {!task.isCompleted && (
          <button onClick={() => setIsTiming(!isTiming)}>
            {isTiming ? "Stop" : <img src={StartTimerIcon} alt="timer" />}
          </button>
        )}
      </td>
      <td>
        {isEditing ? (
          <button onClick={handleUpdate}>
            <img src={EditIcon} alt="Update" />
          </button>
        ) : (
          !task.isCompleted && (
            <button onClick={handleEdit}>
              <img src={EditIcon} alt="Edit" />
            </button>
          )
        )}
      </td>
      <td>
        <button onClick={toggleCompleted}>
          {task.isCompleted ? (
            <img src={XIcon} alt="Undo" />
          ) : (
            <img src={ValidateIcon} alt="Complete" />
          )}
        </button>
      </td>
      <td>
        {!task.isCompleted && (
          <button onClick={() => removeTask(task.id)}>
            <img src={RemoveIcon} alt="Delete" />
          </button>
        )}
      </td>
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

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;

    const today = new Date().toISOString().split("T")[0];

    const newTaskObject = {
      id: new Date().toISOString(),
      name: newTask.trim(),
      isCompleted: false,
      dueDate: dueDate || today,
    };

    setTasks([...tasks, newTaskObject]);
    setNewTask("");
    setDueDate("");
  };

  const removeTask = (taskId) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  };

  const updateTask = (taskId, newName, newDueDate) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, name: newName, dueDate: newDueDate }
        : task
    );
    setTasks(updatedTasks);
  };

  const toggleCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="New task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={addTask}>
        <img src={AddTaskIcon} alt="Add" />
      </button>
      {tasks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Due Date</th>
              <th>Timer</th>
              <th>Edit</th>
              <th>Complete</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                removeTask={removeTask}
                updateTask={updateTask}
                toggleCompleted={toggleCompleted}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;