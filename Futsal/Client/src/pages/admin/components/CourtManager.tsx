import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Wrench,
  CheckCircle2,
  XCircle,
  Users,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { Court } from "../types";

interface CourtManagerProps {
  courts: Court[];
  onOpenAddModal: () => void;
  onOpenEditModal: (court: Court) => void;
  onToggleStatus: (
    court: Court,
    nextStatus: "Active" | "Maintenance" | "Inactive",
  ) => Promise<void>;
  onDeleteCourt: (courtId: number) => Promise<void>;
}

export const CourtManager: React.FC<CourtManagerProps> = ({
  courts,
  onOpenAddModal,
  onOpenEditModal,
  onToggleStatus,
  onDeleteCourt,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.surface.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || court.type === filterType;
    const matchesStatus =
      filterStatus === "All" || court.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = courts.filter((c) => c.status === "Active").length;
  const maintenanceCount = courts.filter(
    (c) => c.status === "Maintenance",
  ).length;
  const inactiveCount = courts.filter((c) => c.status === "Inactive").length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#00f0ff]/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Total Courts
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {courts.length}
              </h3>
              <p className="text-xs text-[#00f0ff] mt-1">Available arenas</p>
            </div>
            <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff] border border-[#00f0ff]/20">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Active & Live
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {activeCount}
              </h3>
              <p className="text-xs text-emerald-400/80 mt-1">
                Open for instant booking
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Maintenance
              </p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">
                {maintenanceCount}
              </h3>
              <p className="text-xs text-amber-400/80 mt-1">
                Turf grooming / repair
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Inactive / Closed
              </p>
              <h3 className="text-3xl font-extrabold text-rose-400 mt-1">
                {inactiveCount}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Temporarily suspended
              </p>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search court by name, surface type, arena..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        {/* Filters & View switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="All">All Arena Types</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Rooftop Turf">Rooftop Turf</option>
            <option value="FIFA Standard 5v5">FIFA Standard</option>
          </select>

          <button
            onClick={onOpenAddModal}
            className="bg-[#00f0ff] hover:bg-white text-black font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-[#00f0ff]/20"
          >
            <Plus className="w-4 h-4" /> Add New Court
          </button>
        </div>
      </div>

      {/* Courts Grid View */}
      {filteredCourts.length === 0 ? (
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-12 text-center">
          <Layers className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white">
            No courts match your search
          </h4>
          <p className="text-sm text-gray-400 mt-1">
            Try resetting the status or type filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredCourts.map((court) => {
            return (
              <div
                key={court.courtId}
                className="bg-[#112233] border border-[#1f384d] rounded-2xl overflow-hidden shadow-xl hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between"
              >
                {/* Court Card Header */}
                <div className="p-5 border-b border-[#1f384d] bg-[#0c1a25]/60 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                        #{court.courtId}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {court.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span>{court.type}</span>
                      <span>•</span>
                      <span>{court.surface}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      court.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : court.status === "Maintenance"
                          ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        court.status === "Active"
                          ? "bg-emerald-400 animate-pulse"
                          : court.status === "Maintenance"
                            ? "bg-amber-400"
                            : "bg-rose-400"
                      }`}
                    />
                    {court.status}
                  </span>
                </div>

                {/* Court Details Body */}
                <div className="p-5 space-y-4 flex-1">
                  {/* Capacity & Description */}
                  <div className="flex items-center justify-between text-xs text-gray-300 bg-[#0c1a25] p-3 rounded-xl border border-[#1f384d]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00f0ff]" />
                      <span>{court.capacity || "5 vs 5 (10 Players)"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00f0ff]" />
                      <span>09:00 AM - 12:00 AM</span>
                    </div>
                  </div>

                  {court.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 italic">
                      "{court.description}"
                    </p>
                  )}

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0c1a25]/80 border border-[#1f384d] rounded-xl p-3">
                      <span className="text-[11px] text-gray-400 block font-medium">
                        Standard Day Rate
                      </span>
                      <span className="text-base font-bold text-white">
                        Rs. {court.basePrice}
                        <span className="text-[11px] text-gray-400 font-normal">
                          {" "}
                          /hr
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        09 AM - 05 PM
                      </span>
                    </div>

                    <div className="bg-[#0c1a25]/80 border border-[#1f384d] rounded-xl p-3">
                      <span className="text-[11px] text-[#00f0ff] block font-medium">
                        Peak Night Rate
                      </span>
                      <span className="text-base font-bold text-[#00f0ff]">
                        Rs. {court.peakPrice}
                        <span className="text-[11px] text-gray-400 font-normal">
                          {" "}
                          /hr
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        06 PM - 11 PM
                      </span>
                    </div>
                  </div>

                  {/* Amenities / Features Chips */}
                  {court.features && court.features.length > 0 && (
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1.5 font-semibold">
                        Court Features
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {court.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="bg-[#162c3e] border border-[#1f384d] text-gray-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-[#00f0ff]" />{" "}
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="p-4 border-t border-[#1f384d] bg-[#0c1a25]/80 flex items-center justify-between gap-2">
                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1.5">
                    {court.status !== "Active" && (
                      <button
                        onClick={() => onToggleStatus(court, "Active")}
                        title="Mark Active"
                        className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Set Active
                      </button>
                    )}

                    {court.status !== "Maintenance" && (
                      <button
                        onClick={() => onToggleStatus(court, "Maintenance")}
                        title="Mark Under Maintenance"
                        className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Wrench className="w-3.5 h-3.5" /> Maintenance
                      </button>
                    )}

                    {court.status !== "Inactive" && (
                      <button
                        onClick={() => onToggleStatus(court, "Inactive")}
                        title="Mark Inactive"
                        className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </button>
                    )}
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEditModal(court)}
                      className="p-2 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] rounded-lg transition-colors border border-[#1f384d]"
                      title="Edit Court Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${court.name}? This cannot be undone.`,
                          )
                        ) {
                          onDeleteCourt(court.courtId);
                        }
                      }}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                      title="Delete Court"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
