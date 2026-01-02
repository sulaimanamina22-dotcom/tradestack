"use client";

import { useState } from "react";

export default function RewardCard({ rate }: { rate: any }) {
  const [hours, setHours] = useState(40);

  const totalRate = rate.base_rate + rate.fringe_rate;
  const basePercent = (rate.base_rate / totalRate) * 100;
  const fringePercent = (rate.fringe_rate / totalRate) * 100;

  // Weekly Math
  const weeklyCash = rate.base_rate * hours;
  const weeklyFringe = rate.fringe_rate * hours;
  const weeklyTotal = totalRate * hours;

  return (
    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl overflow-hidden shadow-xl mb-8">
      {/* 1. Header & Hourly Rate */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-start mb-2">
          <span className="text-gray-400 font-mono text-sm">{rate.code}</span>
          <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded border border-green-800 font-bold uppercase">
            Union
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-4">{rate.classification}</h2>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-white tracking-tighter">
            ${totalRate.toFixed(2)}
          </span>
          <span className="text-gray-500 font-medium">/ hr</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">True Hourly Compensation</p>
      </div>

      {/* 2. The Visual Bar */}
      <div className="flex h-4 w-full">
        <div className="bg-blue-600" style={{ width: `${basePercent}%` }} />
        <div className="bg-purple-500" style={{ width: `${fringePercent}%` }} />
      </div>

      {/* 3. The Simulator Control */}
      <div className="p-6 bg-gray-950 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">
            Weekly Hours Simulator
          </label>
          <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-mono font-bold">
            {hours} hrs
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          step="1"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
        />
      </div>

      {/* 4. The "Weekly Impact" Breakdown */}
      <div className="p-4 bg-gray-900/50">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-gray-300 font-medium">Cash in Pocket</span>
          </div>
          <span className="text-xl font-bold text-white">
            ${weeklyCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-300 font-medium">Benefits Value</span>
          </div>
          <span className="text-xl font-bold text-purple-300">
            ${weeklyFringe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* The "Total Package" Grand Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-400 font-bold uppercase text-sm">Total Weekly Value</span>
          <span className="text-3xl font-black text-green-400">
            ${weeklyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}