import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (Server-Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Force dynamic rendering so it always fetches fresh data
export const dynamic = "force-dynamic";

export default async function RewardsPage() {
  // 1. Get the most recent batch of wages
  const { data: latestBatch } = await supabase
    .from("wage_batches")
    .select("id, name, effective_date")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 2. Get the rates for that batch
  const { data: rates } = await supabase
    .from("wage_rates")
    .select("*")
    .eq("batch_id", latestBatch?.id || "")
    .order("base_rate", { ascending: false });

  if (!rates || rates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <p className="text-xl text-gray-400">No wage data found. Upload a CSV first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="bg-blue-900/20 border-b border-blue-800 p-6 sticky top-0 backdrop-blur-md z-10">
        <h1 className="text-2xl font-black text-blue-400 uppercase tracking-wider">
          Total Rewards
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {latestBatch?.name} • Effective {new Date(latestBatch?.effective_date).toLocaleDateString()}
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="p-4 space-y-6 max-w-md mx-auto">
        {rates.map((rate) => {
          const total = rate.base_rate + rate.fringe_rate;
          const basePercent = (rate.base_rate / total) * 100;
          const fringePercent = (rate.fringe_rate / total) * 100;

          return (
            <div 
              key={rate.id} 
              className="bg-gray-900 border-2 border-gray-800 rounded-xl overflow-hidden shadow-xl"
            >
              {/* Card Header: The "Hero" Number */}
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
                    ${total.toFixed(2)}
                  </span>
                  <span className="text-gray-500 font-medium">/ hr</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">True Hourly Compensation</p>
              </div>

              {/* The "Visualizer" Bar */}
              <div className="flex h-4 w-full">
                <div 
                  className="bg-blue-600" 
                  style={{ width: `${basePercent}%` }} 
                />
                <div 
                  className="bg-purple-500" 
                  style={{ width: `${fringePercent}%` }} 
                />
              </div>

              {/* The Breakdown Table */}
              <div className="p-4 bg-gray-900/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-gray-300 font-medium">Base Pay (Cash)</span>
                  </div>
                  <span className="text-xl font-bold text-white">${rate.base_rate.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-gray-300 font-medium">Benefits (Fringe)</span>
                  </div>
                  <span className="text-xl font-bold text-purple-300">${rate.fringe_rate.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 text-xs px-8 mt-8">
        * Estimates based on prevailing wage determination. <br/>Actual paycheck may vary by tax bracket.
      </div>
    </div>
  );
}