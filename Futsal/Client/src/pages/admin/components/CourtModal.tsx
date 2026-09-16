import React, { useState, useEffect } from "react";
import { X, Info, Layers } from "lucide-react";
import { Court } from "../types";

interface CourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courtData: Partial<Court>) => Promise<void>;
  initialData?: Court | null;
  totalCourtsCount: number;
}

const COMMON_FEATURES = [
  "LED Floodlights",
  "Spectator Seating",
  "Changing Rooms",
  "Shower Facilities",
  "Digital Scoreboard",
  "Air Conditioning Lounge",
  "Equipment Rental",
  "Free Wi-Fi",
  "Beverage Bar",
  "First Aid Kit",
  "CCTV Security",
  "Locker Rooms",
];

export const CourtModal: React.FC<CourtModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  totalCourtsCount,
}) => {
  const [formData, setFormData] = useState<Partial<Court>>({
    courtId: totalCourtsCount + 1,
    name: "",
    type: "Indoor",
    surface: "Premium Artificial Turf (40mm)",
    basePrice: 2500,
    peakPrice: 3000,
    status: "Active",
    capacity: "5 vs 5 (10 Players)",
    features: ["LED Floodlights", "Spectator Seating", "Changing Rooms"],
    description: "",
    imageUrl: "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        features: initialData.features || [],
      });
    } else {
      setFormData({
        courtId: totalCourtsCount + 1,
        name: `Court ${String.fromCharCode(65 + totalCourtsCount)}`,
        type: "Indoor",
        surface: "Premium Artificial Turf (40mm)",
        basePrice: 2500,
        peakPrice: 3000,
        status: "Active",
        capacity: "5 vs 5 (10 Players)",
        features: ["LED Floodlights", "Spectator Seating", "Changing Rooms"],
        description:
          "Equipped with shock-absorbent synthetic turf and tournament lighting.",
        imageUrl: "",
      });
    }
    setError("");
  }, [initialData, totalCourtsCount, isOpen]);

  if (!isOpen) return null;

  const handleToggleFeature = (feat: string) => {
    const current = formData.features || [];
    if (current.includes(feat)) {
      setFormData({ ...formData, features: current.filter((f) => f !== feat) });
    } else {
      setFormData({ ...formData, features: [...current, feat] });
    }
  };

  const handleAddCustomFeature = () => {
    if (!newFeature.trim()) return;
    const feat = newFeature.trim();
    if (!formData.features?.includes(feat)) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), feat],
      });
    }
    setNewFeature("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please enter a court name");
      return;
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      setError("Please provide a valid base hourly price");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to save court",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#112233] border border-[#1f384d] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f384d] bg-[#0c1a25]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00f0ff]/10 rounded-lg text-[#00f0ff] border border-[#00f0ff]/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData
                  ? `Edit ${initialData.name}`
                  : "Add New Futsal Court"}
              </h2>
              <p className="text-xs text-gray-400">
                Configure court specifications, surface, amenities, and hourly
                pricing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#162c3e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Court Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Court Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Court A (Pro Arena)"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>

            {/* Court Number / ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Court ID / Number
              </label>
              <input
                type="number"
                disabled={!!initialData}
                min={1}
                value={formData.courtId || 1}
                onChange={(e) =>
                  setFormData({ ...formData, courtId: Number(e.target.value) })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white disabled:opacity-60 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Court Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Court Type
              </label>
              <select
                value={formData.type || "Indoor"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="Indoor">Indoor Arena</option>
                <option value="Outdoor">Outdoor Field</option>
                <option value="Rooftop Turf">Rooftop Turf</option>
                <option value="FIFA Standard 5v5">FIFA Standard 5v5</option>
                <option value="7v7 Arena">7v7 Tournament Arena</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Operational Status
              </label>
              <select
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "Active"
                      | "Maintenance"
                      | "Inactive",
                  })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="Active">
                  🟢 Active (Available for Booking)
                </option>
                <option value="Maintenance">
                  🟡 Maintenance (Temporarily Closed)
                </option>
                <option value="Inactive">🔴 Inactive (Disabled)</option>
              </select>
            </div>

            {/* Surface Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Turf / Surface Type
              </label>
              <input
                type="text"
                placeholder="e.g. Artificial Turf (40mm)"
                value={formData.surface || ""}
                onChange={(e) =>
                  setFormData({ ...formData, surface: e.target.value })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Capacity / Size
              </label>
              <input
                type="text"
                placeholder="e.g. 5 vs 5 (10 Players)"
                value={formData.capacity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Standard Hourly Rate (LKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={formData.basePrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basePrice: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Day rate (09 AM - 05 PM)
              </span>
            </div>

            {/* Peak Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Peak Hourly Rate (LKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={formData.peakPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      peakPrice: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Night rate (06 PM - 11 PM)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Court Description
            </label>
            <textarea
              rows={2}
              placeholder="Detailed description of court dimensions, flooring, lighting..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] resize-none"
            />
          </div>

          {/* Features / Amenities */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Court Amenities & Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_FEATURES.map((feat) => {
                const isSelected = formData.features?.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => handleToggleFeature(feat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#00f0ff] text-black shadow-sm font-semibold"
                        : "bg-[#162c3e] text-gray-300 hover:bg-[#1f384d] border border-transparent"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {feat}
                  </button>
                );
              })}
            </div>

            {/* Custom feature add */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom amenity (e.g. VIP Balcony)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomFeature();
                  }
                }}
                className="flex-1 bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-4 py-2 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] border border-[#1f384d] text-xs font-semibold rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1f384d] bg-[#0c1a25]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#162c3e] hover:bg-[#1f384d] text-gray-300 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#00f0ff] hover:bg-white text-black font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-[#00f0ff]/20 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update Court Details"
                : "Save & Add Court"}
          </button>
        </div>
      </div>
    </div>
  );
};
