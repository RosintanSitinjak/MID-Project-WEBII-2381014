import { useState, useEffect } from "react";
import {
  fetchData,
  createData,
  deleteData,
  updateData,
} from "../services/apiService";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId?: number;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setTheError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData<{ todos: Todo[] }>("Todos")
      .then((data) => setTodos(data.todos))
      .catch(() => setTheError("Failed to Fetch Todos Data"))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async () => {
    setLoading(true);
    setTheError("");
    try {
      const tempId = Date.now();
      const dummyTodo = await fetchData<Todo>(
        `todos/${Math.floor(Math.random() * 30) + 1}`
      );
      const newTodo = {
        id: tempId,
        todo: dummyTodo.todo,
        completed: false,
        userId: 1,
      };

      setTodos((prev) => [newTodo, ...prev]);

      const todoFromAPI = await createData<Todo>("todos/add", {
        todo: dummyTodo.todo,
        completed: false,
        userId: 1,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === tempId ? { ...todo, id: todoFromAPI.id } : todo
        )
      );
    } catch (error) {
      console.error("Failed Add Todo to API:", error);
      setTheError("failed to Add Todo");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    if (id > 30) return;

    try {
      await updateData<Todo>("todos", id, { completed: !completed });
    } catch (error) {
      console.error("Failed to Changes the Todo Status:", error);
      setTheError("Failed to Changes the Todo Status");
      setTimeout(() => setTheError(""), 3000);
    }
  };

  const updateTodo = async (id: number, todoText: string) => {
    if (id > 30) {
      alert(
        "This data is only stored on the frontend and cannot be updated in the API"
      );
      return;
    }

    const updatedText = prompt("Edit Todo:", todoText);
    if (!updatedText) return;

    setLoading(true);
    try {
      const updatedTodo = await updateData<Todo>("todos", id, {
        todo: updatedText,
        completed: false,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to Update Todo:", error);
      setTheError("Failed to Update Todo");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: number) => {
    if (id > 30) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      return;
    }

    setLoading(true);
    try {
      await deleteData("todos", id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to Delete Todo:", error);
      setTheError("Failed to Delete Todo");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Todos</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-green-700">Loading...</p>}
      <div className="mb-4">
        <button
          onClick={addTodo}
          className="w-full bg-green-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </div>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex justify-between p-3 rounded shadow ${
              todo.completed ? "bg-green-100" : "bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="mr-2"
            />
            <span
              className={todo.completed ? "line-through text-gray-500" : ""}
            >
              {todo.todo}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => updateTodo(todo.id, todo.todo)}
                className="text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-stone-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
