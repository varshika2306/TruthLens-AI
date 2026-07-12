import { useState } from "react";
import { 
  Shield, 
  Layers, 
  History, 
  BookOpen, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Cpu,
  Fingerprint
} from "lucide-react";
import { ActiveTab } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layers, desc: "Control center & telemetry" },
    { id: "investigate", label: "New Investigation", icon: Search, desc: "Secure media ingestion" },
    { id: "history", label: "Investigation History", icon: History, desc: "Past verified dockets" },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen, desc: "Forensic RAG index" },
    { id: "reports", label: "Executive Reports", icon: FileText, desc: "Exportable dossiers" },
    { id: "settings", label: "Settings", icon: Settings, desc: "watsonx & API configuration" }
  ];

  return (
    <div 
      className={`relative h-screen bg-[#060c16] border-r border-cyan-500/10 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-18" : "w-64"
      } select-none`}
    >
      {/* Top Brand Block */}
      <div>
        <div className="flex items-center gap-3 p-4 border-b border-slate-900 overflow-hidden h-[65px]">
          <div className="p-1.5 bg-gradient-to-br from-cyan-950 to-purple-950 rounded-lg border border-cyan-500/30 text-cyan-400 flex-shrink-0 animate-pulse">
            <Fingerprint className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-300">
              <span className="font-sans font-bold text-white text-sm tracking-wide uppercase truncate">
                TruthLens AI
              </span>
              <span className="text-[9px] text-cyan-400 font-mono tracking-wider truncate">
                VERIFY EVERY PIXEL
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onTabChange(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition duration-200 group relative ${
                  isActive 
                    ? "bg-cyan-950/20 border border-cyan-500/25 text-cyan-400 font-medium" 
                    : "border border-transparent text-gray-400 hover:text-white hover:bg-slate-900/40"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"}`} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-sans tracking-wide truncate">{item.label}</div>
                  </div>
                )}

                {/* Left Active Indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer and Collapse Toggle */}
      <div>
        {/* Collapsed view status bulb */}
        {!isCollapsed ? (
          <div className="p-4 mx-3 mb-3 bg-slate-950/50 border border-slate-900 rounded-xl space-y-2.5 transition duration-300">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                IBM WATSONX_OK
              </span>
              <span>v2.4.0</span>
            </div>
            <div className="font-sans text-[10px] text-slate-400 leading-relaxed font-mono">
              SECURE_SHIELD: ACTIVE
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System normal" />
          </div>
        )}

        {/* Collapse Toggle Arrow */}
        <div className="border-t border-slate-900 p-2 flex justify-end">
          <button
            id="btn-sidebar-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-900 hover:border-cyan-500/20 text-gray-500 hover:text-white transition duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
