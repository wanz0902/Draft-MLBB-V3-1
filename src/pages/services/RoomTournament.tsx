import { useState } from "react";
import { motion } from "framer-motion";
import {
  DoorOpen,
  Calendar,
  Clock,
  Users,
  FileText,
  DollarSign,
  ChevronDown,
  AlertCircle,
  Construction,
} from "lucide-react";
import { Link } from "react-router-dom";

interface RoomType {
  id: string;
  label: string;
  description: string;
}

const ROOM_TYPES: RoomType[] = [
  { id: "standard", label: "Standard Room", description: "5v5 custom room with default rules" },
  { id: "ranked", label: "Ranked Scrim Room", description: "Competitive room with ban/pick system" },
  { id: "tournament", label: "Tournament Room", description: "Full bracket tournament room" },
  { id: "practice", label: "Practice Room", description: "Open room for team practice sessions" },
];

const DURATION_OPTIONS = ["1 Hour", "2 Hours", "3 Hours", "Half Day", "Full Day"];

export default function RoomTournament() {
  const [roomType, setRoomType] = useState(ROOM_TYPES[0].id);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [playerCount, setPlayerCount] = useState("10");
  const [customRules, setCustomRules] = useState("");

  const isDropdownOpen = false;

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Room Tournament
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Book tournament rooms for scrims, practice, or competitive matches.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Booking Preview
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <DoorOpen className="h-3.5 w-3.5" />
                  Room Type
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ROOM_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRoomType(type.id)}
                      className="rounded-lg p-3 text-left transition-all duration-200"
                      style={{
                        backgroundColor:
                          roomType === type.id ? "var(--accent-bg)" : "var(--bg-card)",
                        border: `1px solid ${
                          roomType === type.id ? "var(--accent)" : "var(--border)"
                        }`,
                        opacity: roomType === type.id ? 1 : 0.7,
                      }}
                    >
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color:
                            roomType === type.id ? "var(--accent)" : "var(--text-primary)",
                        }}
                      >
                        {type.label}
                      </p>
                      <p
                        className="mt-0.5 text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Date
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Calendar className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Select date (preview)
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Time
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Clock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Select time (preview)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDuration(opt)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor:
                          duration === opt ? "var(--accent-bg)" : "var(--bg-card)",
                        border: `1px solid ${
                          duration === opt ? "var(--accent)" : "var(--border)"
                        }`,
                        color: duration === opt ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Users className="h-3.5 w-3.5" />
                  Player Count
                </label>
                <select
                  value={playerCount}
                  onChange={(e) => setPlayerCount(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-xs outline-none transition"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="5">5 Players (Solo)</option>
                  <option value="10">10 Players (5v5)</option>
                  <option value="20">20 Players (10v10)</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Custom Rules
                </label>
                <textarea
                  value={customRules}
                  onChange={(e) => setCustomRules(e.target.value)}
                  placeholder="e.g., No jungle invade, mirror draft, specific bans..."
                  rows={3}
                  className="w-full resize-none rounded-lg px-3 py-2.5 text-xs outline-none transition placeholder:text-[var(--text-muted)]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-4"
        >
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="mb-4 flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              <DollarSign className="h-4 w-4" style={{ color: "var(--accent)" }} />
              Price Estimate
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Room Type
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {ROOM_TYPES.find((t) => t.id === roomType)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Duration
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Players
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {playerCount}
                </span>
              </div>
              <div
                className="my-2 h-px"
                style={{ backgroundColor: "var(--border)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Estimated Total
                </span>
                <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                  Rp 0
                </span>
              </div>
            </div>
            <div
              className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                backgroundColor: "var(--accent-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <Construction className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                Coming Soon
              </span>
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <AlertCircle className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Booking System
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Coming soon
                </p>
              </div>
            </div>
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              The full booking system with real-time availability, automatic room creation, and payment processing is currently under development.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition"
          style={{
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          Back to App
        </Link>
      </div>
    </div>
  );
}
