"use client";
import { useEffect, useState } from "react";

export default function PunchKiosk() {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [status, setStatus] = useState("Ready to Work");
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  // Use Environment Variable or fallback to localhost
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // 1. LOAD DROPDOWN DATA
  useEffect(() => {
    fetch(`${API_BASE_URL}/time-log/context`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setProjects(data.projects || []);
      })
      .catch(err => setStatus("❌ Connection Error: Backend Offline"));
  }, [API_BASE_URL]);

  // 2. ACTUAL CLOCK IN (Real GPS)
  const handleClockIn = () => {
    if (!selectedUser || !selectedProject) return alert("Select User & Project!");
    setStatus("Acquiring GPS...");

    navigator.geolocation.getCurrentPosition(
      (position) => sendPunch(position.coords.latitude, position.coords.longitude),
      (err) => setStatus("❌ GPS Denied. Try 'Simulate' button below.")
    );
  };

  // 3. DEV BYPASS (Fake GPS)
  const handleSimulate = () => {
    if (!selectedUser || !selectedProject) return alert("Select User & Project!");
    setStatus("📡 Simulating Satellite Link...");
    // Hardcoded coordinates for 'Downtown Library'
    setTimeout(() => sendPunch(32.7157, -117.1611), 800);
  };

  // 4. SHARED PUNCH LOGIC
  async function sendPunch(lat: number, long: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/time-log/in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          projectId: selectedProject,
          lat: lat,
          long: long
        })
      });

      if (!res.ok) throw new Error("Clock In Failed");
      
      const log = await res.json();
      setActiveLogId(log.id);
      setStatus(log.is_flagged ? "⚠️ Clocked In (Flagged: Off-Site)" : "✅ Clocked In (On-Site)");
    } catch (err) {
      setStatus("❌ Error: " + err);
    }
  }

  // 5. CLOCK OUT
  const handleClockOut = async () => {
    if (!activeLogId) return;
    await fetch(`${API_BASE_URL}/time-log/out/${activeLogId}`, { method: "PATCH" });
    setStatus("👋 Shift Complete. Have a good night!");
    setActiveLogId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-400">TradeStack Kiosk</h1>
        <p className="text-gray-400 text-center mb-6 text-sm">Satellite Verified Timeclock</p>

        {/* SELECT WORKER */}
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Worker</label>
        <select 
          className="w-full mb-4 p-3 bg-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select Identity --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.default_trade})</option>)}
        </select>

        {/* SELECT PROJECT */}
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Site</label>
        <select 
          className="w-full mb-6 p-3 bg-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Location --</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        {/* STATUS SCREEN */}
        <div className="mb-6 p-4 bg-black/30 rounded text-center font-mono text-sm border border-gray-600">
          {status}
        </div>

        {/* BIG BUTTONS */}
        {!activeLogId ? (
          <div className="space-y-3">
            <button 
              onClick={handleClockIn}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg text-xl"
            >
              PUNCH IN
            </button>
            
            <button 
              onClick={handleSimulate}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded border border-gray-500 text-sm"
            >
              🛠️ DEV MODE: SIMULATE GPS
            </button>
          </div>
        ) : (
          <button 
            onClick={handleClockOut}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg text-xl"
          >
            PUNCH OUT
          </button>
        )}
      </div>
    </div>
  );
}