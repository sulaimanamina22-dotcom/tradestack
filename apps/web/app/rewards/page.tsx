import { createClient } from "@supabase/supabase-js";
import RewardCard from "./RewardCard"; // <--- Import the new component

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
          {latestBatch?.name.replace(".csv", "")} • Effective {new Date(latestBatch?.effective_date).toLocaleDateString()}
        </p>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="p-4 space-y-6 max-w-md mx-auto">
        {rates.map((rate) => (
          <RewardCard key={rate.id} rate={rate} />
        ))}
      </div>
      
      <div className="text-center text-gray-600 text-xs px-8 mt-8">
        * Simulator estimates based on prevailing wage determination. <br/>Actual paycheck may vary by tax bracket.
      </div>
    </div>
  );
}