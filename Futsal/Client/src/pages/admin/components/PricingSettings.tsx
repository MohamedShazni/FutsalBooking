import React, { useState } from "react";
import { DollarSign, Clock, Zap, ShieldCheck, Save } from "lucide-react";
import { Court } from "../types";

interface PricingSettingsProps {
  courts: Court[];
  onBulkUpdatePricing: (basePrice: number, peakPrice: number) => Promise<void>;
}

export const PricingSettings: React.FC<PricingSettingsProps> = ({
  courts,
  onBulkUpdatePricing,
}) => {
  const [globalBasePrice, setGlobalBasePrice] = useState(2500);
  const [globalPeakPrice, setGlobalPeakPrice] = useState(3000);
  const [peakStartHour, setPeakStartHour] = useState("06:00 PM");
  const [peakEndHour, setPeakEndHour] = useState("11:00 PM");
  const [weekendSurcharge, setWeekendSurcharge] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleApplyPricing = async () => {
    try {
      setIsSaving(true);
      await onBulkUpdatePricing(globalBasePrice, globalPeakPrice);
      setSavedMessage(
        "Pricing rules updated successfully across all active courts!",
      );
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert("Failed to update pricing: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff] border border-[#00f0ff]/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Dynamic Pricing & Peak Hours Setup
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Control standard hourly rates, peak evening multipliers, and
              weekend tariffs.
            </p>
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Standard & Peak Rates */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-5">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00f0ff]" /> Hourly Rate Presets
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Standard Daytime Rate (09 AM - 05 PM)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={globalBasePrice}
                  onChange={(e) => setGlobalBasePrice(Number(e.target.value))}
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-12 pr-4 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Peak Night Rate (06 PM - 11 PM)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f0ff] text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={globalPeakPrice}
                  onChange={(e) => setGlobalPeakPrice(Number(e.target.value))}
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-12 pr-4 py-2.5 text-[#00f0ff] font-bold text-lg focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Weekend Surcharge (Saturday & Sunday)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  + Rs.
                </span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={weekendSurcharge}
                  onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-14 pr-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <button
              onClick={handleApplyPricing}
              disabled={isSaving}
              className="w-full py-3 bg-[#00f0ff] hover:bg-white text-black font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-[#00f0ff]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Updating Courts..." : "Apply Rates to All Courts"}
            </button>
          </div>
        </div>

        {/* Peak Hours Schedule Definition */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-5">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00f0ff]" /> Peak Hours
            Configuration
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Peak Window Starts
                </label>
                <select
                  value={peakStartHour}
                  onChange={(e) => setPeakStartHour(e.target.value)}
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM (Default)</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Peak Window Ends
                </label>
                <select
                  value={peakEndHour}
                  onChange={(e) => setPeakEndHour(e.target.value)}
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="11:00 PM">11:00 PM (Default)</option>
                  <option value="12:00 AM">12:00 AM Midnight</option>
                </select>
              </div>
            </div>

            {/* Court by court pricing summary */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-2">
                Current Court-Wise Rates
              </span>
              <div className="space-y-2 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
                {courts.map((court) => (
                  <div
                    key={court.courtId}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0c1a25] border border-[#1f384d] text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{court.name}</span>
                      <span className="text-gray-400 ml-2">({court.type})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">
                        Day: Rs. {court.basePrice}
                      </span>
                      <span className="text-[#00f0ff] font-semibold">
                        Peak: Rs. {court.peakPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
