// src/components/AuthForm.jsx
import { useState } from "react";

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function readLS(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function handleRegister(e) {
    e.preventDefault();
    if (!name || !email || !password) return setErr("Fill all fields");
    const users = readLS("cbs_users_v1", []);
    if (users.find((u) => u.email === email)) return setErr("Email already registered");
    const newUser = { id: `u_${Date.now()}`, name, email, password };
    users.push(newUser);
    writeLS("cbs_users_v1", users);
    writeLS("cbs_auth_v1", { id: newUser.id, name: newUser.name, email: newUser.email });
    onAuthSuccess(newUser);
  }

  function handleLogin(e) {
    e.preventDefault();
    const users = readLS("cbs_users_v1", []);
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return setErr("Invalid email or password");
    writeLS("cbs_auth_v1", { id: found.id, name: found.name, email: found.email });
    onAuthSuccess(found);
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow rounded p-6">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 rounded ${mode === "login" ? "bg-slate-800 text-white" : "bg-slate-100"}`}
          onClick={() => { setMode("login"); setErr(""); }}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 rounded ${mode === "register" ? "bg-slate-800 text-white" : "bg-slate-100"}`}
          onClick={() => { setMode("register"); setErr(""); }}
        >
          Register
        </button>
      </div>

      <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
        {mode === "register" && (
          <div className="mb-3">
            <label className="text-sm">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" />
          </div>
        )}
        <div className="mb-3">
          <label className="text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded p-2" />
        </div>
        <div className="mb-3">
          <label className="text-sm">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border rounded p-2" />
        </div>
        {err && <div className="text-red-500 mb-2">{err}</div>}
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
