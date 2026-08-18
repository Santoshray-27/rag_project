import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError("Failed to connect to the backend. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>DocuMind</h1>
      <h2>Backend Status</h2>

      {loading && <p>Checking backend...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {status && (
        <div style={{ 
          background: "#f0fff0", 
          padding: "1rem", 
          borderRadius: "8px",
          border: "1px solid green"
        }}>
          <p>✅ Success: {String(status.success)}</p>
          <p>📢 Message: {status.message}</p>
          <p>🌍 Environment: {status.environment}</p>
        </div>
      )}
    </div>
  );
}

export default App;