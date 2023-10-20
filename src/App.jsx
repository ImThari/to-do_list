import { useState, useEffect } from "react";
import { onAuthStateChanged } from './config/firebase';
import Auth from './components/Auth.jsx';
import Task from './components/Task.jsx';
import AddTaskIcon from "./assets/plus.svg";
import { ref, set, onValue, remove, update, push  } from 'firebase/database';
import { db,auth, signOut } from './config/firebase';
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const tasksRef = ref(db, `tasks/${user.uid}`);
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const firebaseTasks = snapshot.val();
        const tasksArray = firebaseTasks ? Object.keys(firebaseTasks).map(key => ({ ...firebaseTasks[key], id: key })) : [];
        setTasks(tasksArray);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addTask = () => {
    if (newTask.trim() === "" || !user) return;

    const today = new Date().toISOString().split("T")[0];

    const newTaskObject = {
      name: newTask.trim(),
      isCompleted: false,
      dueDate: dueDate || today,
    };

    const tasksRef = ref(db, `tasks/${user.uid}`);
    const newTaskRef = push(tasksRef);
    set(newTaskRef, newTaskObject);

    setNewTask("");
    setDueDate("");
  };

  const removeTask = (taskId) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    remove(taskRef);
  };

  const updateTask = (taskId, newName, newDueDate) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    update(taskRef, { name: newName, dueDate: newDueDate });
  };

  const toggleCompleted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    update(taskRef, { isCompleted: !task.isCompleted });
  };

  const handleSignOut = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err.message);
    }
  };

  let displayedTasks = tasks;
  if (filter === "completed") {
    displayedTasks = tasks.filter(task => task.isCompleted);
  } else if (filter === "notCompleted") {
    displayedTasks = tasks.filter(task => !task.isCompleted);
  }

  if (!user) return <Auth />;

  return (
    <div className="App">
 <header>
    <h1>To-Do List</h1>
    {user && (
      <button onClick={handleSignOut}>Se déconnecter</button>
    )}
  </header>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All tasks</option>
        <option value="completed">Completed tasks</option>
        <option value="notCompleted">Not completed tasks</option>
      </select>

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

      {displayedTasks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Due Date</th>
              <th>Edit</th>
              <th>Complete</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {displayedTasks.map((task) => (
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