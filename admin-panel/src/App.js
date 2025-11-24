import React, { useState, useEffect } from "react";
import { api, setToken } from "./api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    const res = await api.post("/auth/login", form);
    setToken(res.data.access_token);
    onLogin(res.data.access_token);
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 320, margin: "50px auto" }}>
      <h2>Admin login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit">Login</button>
    </form>
  );
}

function Excuses() {
  const [excuses, setExcuses] = useState([]);

  const load = async () => {
    const res = await api.get("/excuses/");
    setExcuses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/excuses/${id}/status`, null, {
      params: { status },
    });
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Omluvenky</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Child</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {excuses.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.child_name}</td>
              <td>{e.date_from}</td>
              <td>{e.date_to}</td>
              <td>{e.reason}</td>
              <td>{e.status}</td>
              <td>
                <button onClick={() => updateStatus(e.id, "approved")}>
                  Approve
                </button>
                <button onClick={() => updateStatus(e.id, "rejected")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [token, setTokenState] = useState(null);

  if (!token) {
    return <Login onLogin={setTokenState} />;
  }

  return <Excuses />;
}

export default App;
