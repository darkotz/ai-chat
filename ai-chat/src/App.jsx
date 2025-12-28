import { useState } from "react";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:1234/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "local-model",
            messages: newMessages,
          }),
        }
      );

      const data = await response.json();

      const aiMessage = data.choices[0].message.content;

      setMessages([...newMessages, { role: "assistant", content: aiMessage }]);
    } catch (err) {
      console.error(err);
      alert("error");
    }

    setLoading(false);
  }

  return (
    <div className="app">
      <div className="chat">
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#4f46e5" : "#333",
              }}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  message: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: 10,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
  },
};

export default App;
