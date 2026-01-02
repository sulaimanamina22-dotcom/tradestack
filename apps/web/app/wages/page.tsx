"use client";

import { useState } from "react";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Initialize Supabase Client for the Frontend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WageManager() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("Reading file...");

    // 1. Parse the CSV locally in the browser
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          setStatus(`Parsed ${results.data.length} rates. Uploading to database...`);
          await uploadToSupabase(results.data, file.name);
        } catch (err) {
          console.error(err);
          setStatus("❌ Error uploading data. Check console.");
        } finally {
          setUploading(false);
        }
      },
    });
  };

  const uploadToSupabase = async (data: any[], filename: string) => {
    // 2. Create a new "Batch" container for this upload
    const batchName = `${filename} - ${new Date().toLocaleDateString()}`;
    
    const { data: batchData, error: batchError } = await supabase
      .from("wage_batches")
      .insert([{ name: batchName, effective_date: new Date().toISOString() }])
      .select()
      .single();

    if (batchError) throw batchError;

    // 3. Format the data for Supabase
    const rates = data.map((row) => ({
      batch_id: batchData.id,
      code: row.Code,
      classification: row.Classification,
      base_rate: parseFloat(row.BaseRate),
      fringe_rate: parseFloat(row.FringeRate),
    }));

    // 4. Insert all rates at once
    const { error: ratesError } = await supabase
      .from("wage_rates")
      .insert(rates);

    if (ratesError) throw ratesError;

    setStatus("✅ Success! Wage rates uploaded and active.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline mb-8 block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Wage Determination Manager</h1>
        <p className="text-gray-400 mb-8">
          Upload CSV files to update Prevailing Wage rates.
        </p>

        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
          <label className="block mb-4 text-sm font-medium text-gray-300">
            Upload CSV (Columns: Code, Classification, BaseRate, FringeRate)
          </label>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
          />

          {status && (
            <div className={`mt-6 p-4 rounded-lg ${status.includes("Success") ? "bg-green-900/30 text-green-400" : "bg-gray-700"}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}