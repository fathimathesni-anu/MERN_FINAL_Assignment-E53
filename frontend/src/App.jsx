import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://todobackend-yh7d.onrender.com/api"; // Backend URL

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos", err);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      console.log("Login response:", res.data);
      
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        console.log("Login successful. Token set.");
        fetchTodos(); // Fetch todos after login
      } else {
        console.error("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
    }
  };
  
  

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
      handleLogin();
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  const addTodo = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/todos`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Error adding todo", err);
    }
  };

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setTodos([]); // Clear todos on logout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {!isLoggedIn ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Login / Register</h2>
            <input
              className="w-full p-2 mb-2 border"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 mb-2 border"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white py-2" onClick={handleLogin}>
              Login
            </button>
            <button className="w-full bg-green-500 text-white py-2 mt-2" onClick={handleRegister}>
              Register
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Todo List</h2>
            <input
              className="w-full p-2 mb-2 border"
              placeholder="New Todo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white py-2" onClick={addTodo}>
              Add Todo
            </button>
            <ul className="mt-4">
              {todos.map((todo) => (
                <li key={todo._id} className="p-2 border-b">
                  {todo.title}
                </li>
              ))}
            </ul>
            <button className="w-full bg-red-500 text-white py-2 mt-4" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


