"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    // Corrected the spelling from 'tution' to 'restitution'
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    fetch(`${API_URL}/restitution/violations`)
      .then((res) => {
        if (!res.ok) throw new Error("API responded with an error");
        return res.json();
      })
      .then((data) => {
        // Safety check: Ensure we only set an array to avoid .map() crashes
        setData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch API:", err);
        setLoading(false);
      });
  }, []);

  // 2. HANDLE PAY BUTTON
  const handlePay = async (violationId: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    await fetch(`${API_URL}/restitution/pay/${violationId}`, { method: 'POST' });
    // Refresh data
    const res = await fetch(`${API_URL}/restitution/violations`);
    const updated = await res.json();
    setData(updated);
  };

  if (loading) return <div className="p-10 text-white bg-gray-900 min-h-screen">Loading Compliance Data...</div>;

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">TradeStack Audit</h1>
            <p className="text-gray-400">Davis-Bacon Act & Geospatial Verification</p>
          </div>
          <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
            {data.length} Violations Detected
          </div>
        </header>

        <div className="grid gap-6">
          {data.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-600">
              <p className="text-gray-500">✅ All sites compliant. No violations found.</p>
            </div>
          ) : (
            data.map((v) => (
              <div key={v.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded">FLAGGED PUNCH</span>
                    <span className="text-gray-400 text-sm">{new Date(v.time_log.clock_in).toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-bold">{v.time_log.user.full_name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{v.time_log.project.name} • {v.time_log.user.default_trade}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-3 rounded">
                    <div>
                      <p className="text-gray-500 uppercase text-[10px] font-bold">Paid Rate</p>
                      <p className="text-red-400 font-mono text-lg">${v.paid_rate}/hr</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[10px] font-bold">Required Rate</p>
                      <p className="text-green-400 font-mono text-lg">${v.required_rate}/hr</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-gray-500 text-xs mb-1 uppercase font-bold">Restitution Owed</p>
                  <p className="text-3xl font-black text-white mb-4">${v.amount_owed.toFixed(2)}</p>
                  <button 
                    onClick={() => handlePay(v.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg active:scale-95"
                  >
                    PROCESS PAY
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}