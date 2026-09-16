import React, { useState } from "react";
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const [centerName, setCenterName] = useState("S7 Futsal & Sports Complex");
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [email, setEmail] = useState("bookings@s7futsal.com");
  const [address, setAddress] = useState(
    "No. 128, Sports Arena Way, Colombo, Sri Lanka",
  );
  const [openTime, setOpenTime] = useState("09:00 AM");
  const [closeTime, setCloseTime] = useState("12:00 AM Midnight");
  const [slotDuration, setSlotDuration] = useState("60 Minutes");
  const [cancellationPolicy, setCancellationPolicy] = useState(
    "Free cancellation up to 4 hours before kickoff time.",
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff] border border-[#00f0ff]/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Futsal Center Configuration
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage venue profile, business hours, customer contact info, and
              policies.
            </p>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Venue Information */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-[#00f0ff]" /> Venue Profile
          </h4>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Center / Complex Name
            </label>
            <input
              type="text"
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00f0ff]" /> Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00f0ff]" /> Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" /> Physical Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff] resize-none"
            />
          </div>
        </div>

        {/* Operating Hours & Rules */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#00f0ff]" /> Schedule & Policies
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Daily Opening Time
              </label>
              <input
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Daily Closing Time
              </label>
              <input
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Standard Slot Duration
            </label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="60 Minutes">60 Minutes (1 Hour)</option>
              <option value="90 Minutes">90 Minutes (1.5 Hours)</option>
              <option value="120 Minutes">120 Minutes (2 Hours)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Cancellation / Refund Policy
            </label>
            <textarea
              rows={2}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00f0ff] hover:bg-white text-black font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-[#00f0ff]/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Center Settings
          </button>
        </div>
      </form>
    </div>
  );
};
