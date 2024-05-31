import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      console.log("Loading tasks from localStorage");
      setTasks(JSON.parse(savedTasks));
    } else {
      console.log("Creating tasks from user input");
      const defaultTasks = [];
      setTasks(defaultTasks);
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  const isValidTask = (task) => {
    if (!task.trim()) {
      alert("Task cannot be empty or just whitespace.");
      return false;
    }
    if (task.length < 3) {
      alert("Task must be at least 3 characters long.");
      return false;
    }
    if (task.length > 100) {
      alert("Task must be less than 100 characters long.");
      return false;
    }
    if (tasks.some((t) => t.id !== editId && t.text === task)) {
      alert("Task already exists.");
      return false;
    }
    return true;
  };

  const addTask = () => {
    if (isValidTask(task)) {
      if (editId !== null) {
        const updatedTasks = tasks.map((t) =>
          t.id === editId ? { ...t, text: task, description } : t
        );
        setTasks(updatedTasks);
        setEditId(null);
      } else {
        const newTask = {
          id: uuidv4(),
          text: task,
          description,
          completed: false,
        };
        setTasks([...tasks, newTask]);
      }
      setTask("");
      setDescription("");
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  const removeTask = (id) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const toggleTaskCompletion = (id) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    setTask(taskToEdit.text);
    setDescription(taskToEdit.description);
    setEditId(id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === "alphabetical") return a.text.localeCompare(b.text);
    return 0;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-heading">To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="custom-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="custom-input"
        />
        <button onClick={addTask} className="custom-button">
          {editId !== null ? "Edit Task" : "Add Task"}
        </button>
      </div>
      <div className="filters">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="custom-select"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="custom-select"
        >
          <option value="default">Default</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <div className="task-list">
        {sortedTasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              className="custom-checkbox"
            />
            <div className="task-text">
              <div>{task.text}</div>
              {task.description && (
                <div className="task-description">{task.description}</div>
              )}
            </div>
            <button onClick={() => editTask(task.id)} className="edit-button">
              Edit
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
