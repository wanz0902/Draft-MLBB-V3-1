import { motion } from "framer-motion";
import {
  Swords,
  DoorOpen,
  UserCheck,
  ClipboardList,
  Eye,
  Mic,
  Radio,
  Layers,
  Camera,
  Film,
  FileText,
  Crown,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  price: string;
}

const SERVICES: ServiceCard[] = [
  { icon: Swords, title: "Custom Room", description: "Create private custom rooms for scrim or practice with your team.", price: "Rp 15.000" },
  { icon: DoorOpen, title: "Tournament Room", description: "Official tournament room with bracket management and scheduling.", price: "Rp 25.000" },
  { icon: UserCheck, title: "Referee", description: "Professional referee to ensure fair play and rule enforcement.", price: "Rp 35.000" },
  { icon: ClipboardList, title: "Match Admin", description: "Full match administration including lobby setup and result recording.", price: "Rp 30.000" },
  { icon: Eye, title: "Observer", description: "Dedicated observer for live spectating with professional camera control.", price: "Rp 20.000" },
  { icon: Mic, title: "Caster", description: "Live commentary and casting for your scrim or tournament matches.", price: "Rp 40.000" },
  { icon: Radio, title: "Live Streaming", description: "Professional live stream production with overlays and transitions.", price: "Rp 50.000" },
  { icon: Layers, title: "Overlay", description: "Custom stream overlays, scoreboards, and in-game graphics.", price: "Rp 15.000" },
  { icon: Camera, title: "Recording", description: "Match recording with high-quality VOD for review and analysis.", price: "Rp 10.000" },
  { icon: Film, title: "Highlight Video", description: "Edited highlight reels and montages from your matches.", price: "Rp 45.000" },
  { icon: FileText, title: "Draft Analysis Report", description: "In-depth draft analysis report with recommendations and insights.", price: "Rp 20.000" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function ScrimServices() {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Scrim Services
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Professional esports services for scrims, tournaments, and content creation.
        </p>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group relative flex flex-col rounded-xl p-5 transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "var(--accent-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    from {service.price}
                  </p>
                </div>
              </div>
              <p
                className="mb-4 flex-1 text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {service.description}
              </p>
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Coming Soon
                </span>
                <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-xl p-5"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "var(--accent-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <Crown className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Membership Discount
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Exclusive pricing for members
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Membership tier discounts will be applied automatically once payment integration is live. Elite and Pro members will receive priority booking and discounted rates across all services.
        </p>
        <div
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <Crown className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            Coming Soon
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
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
            <CreditCard className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Payment Integration
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Secure payment processing coming soon
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          We are working on integrating secure payment methods including e-wallets, bank transfers, and QR payments. All transactions will be encrypted and processed through certified payment providers.
        </p>
        <div
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <CreditCard className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            Coming Soon
          </span>
        </div>
      </motion.div>

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
