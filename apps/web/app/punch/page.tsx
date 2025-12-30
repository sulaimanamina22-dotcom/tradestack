"use client";
import { useEffect, useState } from "react";

export default function PunchKiosk() {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [status, setStatus] = useState("Ready to Work");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  // Dynamic API URL for production
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/time-log/context`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setProjects(data.projects || []);
      })
      .catch(() => setStatus("❌ Connection Error: Backend Offline"));
  }, [API_URL]);

  const handleSimulate = async () => {
    if (!selectedUser || !selectedProject) return alert("Select User & Project!");
    setStatus("📡 Simulating Satellite Link...");
    
    try {
      const res = await fetch(`${API_URL}/time-log/in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          projectId: selectedProject,
          lat: 32.7157, 
          long: -117.1611
        })
      });

      if (!res.ok) throw new Error();
      const log = await res.json();
      setActiveLogId(log.id);
      setStatus(log.is_flagged ? "⚠️ Clocked In (Flagged: Off-Site)" : "✅ Clocked In (On-Site)");
    } catch {
      setStatus("❌ Punch Failed. Check API logs.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-400">TradeStack Kiosk</h1>
        
        <select 
          className="w-full mb-4 p-3 bg-gray-700 rounded"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select Worker --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
        </select>

        <select 
          className="w-full mb-6 p-3 bg-gray-700 rounded"
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Site --</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div className="mb-6 p-4 bg-black/30 rounded text-center font-mono text-sm border border-gray-600">
          {status}
        </div>

        {!activeLogId ? (
          <button onClick={handleSimulate} className="w-full py-4 bg-green-600 font-bold rounded-lg">
            PUNCH IN (SIMULATED)
          </button>
        ) : (
          <button onClick={() => setActiveLogId(null)} className="w-full py-4 bg-red-600 font-bold rounded-lg">
            PUNCH OUT
          </button>
        )}
      </div>
    </div>
  );
}