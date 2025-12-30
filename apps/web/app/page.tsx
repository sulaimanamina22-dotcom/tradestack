"use client";
import { useEffect, useState } from "react";

// Define what the data looks like
interface Restitution {
  id: string;
  owed_cash: string;
  owed_fringe: string;
  status: string;
  time_log: {
    user: { full_name: string };
    project: { name: string };
    trade_rate: { classification: string };
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<Restitution[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/restitution/violations`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch API:", err));
  }, []);

  // 2. HANDLE PAY BUTTON
  const handlePay = async (id: string) => {
    await fetch(`http://localhost:3000/restitution/${id}`, { method: "PATCH" });
    // Refresh the list locally
    setData(data.filter((item) => item.id !== id));
    alert("Payment Processed! Checks are being printed.");
  };

  if (loading) return <div className="p-10">Loading Compliance Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans text-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">TradeStack Command Center</h1>
        <p className="text-gray-600">Compliance & Restitution Monitoring</p>
      </header>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Worker</th>
              <th className="p-4 border-b">Project</th>
              <th className="p-4 border-b">Violation</th>
              <th className="p-4 border-b">Owed (Cash)</th>
              <th className="p-4 border-b">Owed (Fringe)</th>
              <th className="p-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-green-600 font-bold">All Clear! No violations found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-red-50 transition">
                  <td className="p-4 font-medium">{item.time_log.user.full_name}</td>
                  <td className="p-4 text-gray-600">{item.time_log.project.name}</td>
                  <td className="p-4 text-red-600 font-semibold">
                    {item.time_log.trade_rate.classification} (Underpaid)
                  </td>
                  <td className="p-4 font-mono font-bold">${item.owed_cash}</td>
                  <td className="p-4 font-mono text-gray-500">${item.owed_fringe}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handlePay(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold"
                    >
                      PROCESS PAY
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}