import { useState } from "react";
import "./App.css";
import FoodContainer from "./components/FoodContainer";

function TodoOne() {
  const [buttonColor, setButtonColor] = useState("red");
  const [message, setMessage] = useState("Hello world");
  const [messageColor, setMessageColor] = useState("#ff0080");
  const [count, setCount] = useState(0);

  return (
    <section className="exercise-card" aria-labelledby="todo-one-heading">
      <h2 id="todo-one-heading">Todo 1: React State</h2>

      <div className="color-buttons">
        <button
          className="color-button"
          style={{
            backgroundColor: buttonColor,
            color: buttonColor === "blue" ? "white" : "black",
          }}
          onClick={() =>
            setButtonColor((color) => (color === "red" ? "blue" : "red"))
          }
        >
          {buttonColor === "red" ? "Go Blue" : "Go Red"}
        </button>
      </div>

      <div className="message-controls">
        <p className="live-message" style={{ color: messageColor }}>
          {message}
        </p>
        <div className="message-inputs">
          <label className="sr-only" htmlFor="message-input">
            Message
          </label>
          <input
            id="message-input"
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <label className="sr-only" htmlFor="message-color">
            Message color
          </label>
          <input
            id="message-color"
            className="color-picker"
            type="color"
            value={messageColor}
            onChange={(event) => setMessageColor(event.target.value)}
          />
        </div>
      </div>

      <div className="counter">
        <p aria-live="polite">{count}</p>
        <div className="counter-buttons">
          <button onClick={() => setCount((value) => value + 1)}>
            Count Up
          </button>
          <button onClick={() => setCount((value) => value - 1)}>
            Count Down
          </button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [activeTodo, setActiveTodo] = useState(1);

  return (
    <main className="App">
      <nav className="todo-navigation" aria-label="Exercises">
        <button
          className={activeTodo === 1 ? "nav-button active" : "nav-button"}
          aria-current={activeTodo === 1 ? "page" : undefined}
          onClick={() => setActiveTodo(1)}
        >
          Todo 1
        </button>
        <button
          className={activeTodo === 2 ? "nav-button active" : "nav-button"}
          aria-current={activeTodo === 2 ? "page" : undefined}
          onClick={() => setActiveTodo(2)}
        >
          Todo 2
        </button>
      </nav>

      {activeTodo === 1 ? <TodoOne /> : <FoodContainer />}
    </main>
  );
}

export default App;
