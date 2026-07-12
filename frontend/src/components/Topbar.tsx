import { useState, useEffect } from "react";
import { Cpu, Terminal, Clock, ShieldCheck, User } from "lucide-react";
import { ActiveTab } from "../types";

interface TopbarProps {
  activeTab: ActiveTab;
}

export default function Topbar({ activeTab }: TopbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "INVESTIGATION DASHBOARD";
      case "investigate": return "SECURE INGESTION LAB";
      case "history": return "FORENSIC CASE LOGS";
      case "knowledge": return "RAG VERIFICATION INDEX";
      case "reports": return "EXECUTIVE DOSSIERS";
      case "settings": return "SUITE CONFIGURATION";
      default: return "TRUTHLENS AI";
    }
  };

  return (
    <header className="h-[65px] bg-[#08111f] border-b border-cyan-500/10 flex items-center justify-between px-6 select-none relative z-40">
      {/* Active Tab Heading */}
      <div className="flex items-center gap-3">
        <h2 className="font-mono text-sm font-bold text-white tracking-wider uppercase">
          {getTitle()}
        </h2>
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/15 rounded text-[9px] font-mono text-cyan-400">
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
          ORCHESTRATED_NODE_OK
        </div>
      </div>

      {/* Stats, Clock & User */}
      <div className="flex items-center gap-6">
        {/* Systems Telemetry */}
        <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>MODEL:</span>
            <span className="text-white">IBM Granite v2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>INFRA:</span>
            <span className="text-white">watsonx.ai</span>
          </div>
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-300 bg-slate-950/40 border border-slate-900 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-[#0e1d33] border border-cyan-500/15 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <div className="p-1 bg-cyan-950 text-cyan-400 rounded">
            <User className="w-3 h-3" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-gray-500 font-mono font-bold leading-none">INVESTIGATOR</span>
            <span className="font-sans text-[11px] text-white font-medium mt-0.5 truncate max-w-[120px]">
              varshika425@gmail.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
