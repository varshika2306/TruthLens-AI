import { Shield, Eye, Database, Brain, FileText, MessageSquare, ArrowRight } from "lucide-react";

export default function AgentWorkflow() {
  const agents = [
    {
      id: "evidence",
      name: "Evidence Agent",
      role: "Secure Ingestion",
      status: "ACTIVE",
      desc: "Pins SHA-256 hash, extracts metadata blocks.",
      icon: Shield,
      glow: "border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
    },
    {
      id: "visual",
      name: "Visual Analysis Agent",
      role: "Signal Forensics",
      status: "ACTIVE",
      desc: "Triggers Fourier, ELA, and lighting vector scans.",
      icon: Eye,
      glow: "border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
    },
    {
      id: "knowledge",
      name: "Knowledge Retrieval Agent",
      role: "RAG Pipeline",
      status: "ACTIVE",
      desc: "Searches verified IEEE & Watson databases.",
      icon: Database,
      glow: "border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    },
    {
      id: "granite",
      name: "IBM Granite Reasoning Agent",
      role: "Cognitive Synthesis",
      status: "ACTIVE",
      desc: "Unifies data contradictions & evaluates risk.",
      icon: Brain,
      glow: "border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    },
    {
      id: "report",
      name: "Report Generation Agent",
      role: "Executive Drafting",
      status: "ACTIVE",
      desc: "Formulates printable verdicts with recommendations.",
      icon: FileText,
      glow: "border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
    },
    {
      id: "watson",
      name: "Watson Assistant",
      role: "Conversational Copilot",
      status: "ACTIVE",
      desc: "Provides interactive QA and reasoning dialogues.",
      icon: MessageSquare,
      glow: "border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    }
  ];

  return (
    <div className="w-full bg-slate-950/40 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
      {/* Background abstract connection curve */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-950/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-sans font-semibold tracking-wider text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
            Agentic AI Orchestration Sequence
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Multi-agent consensus framework powered by IBM Granite Instruct and watsonx.ai
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-gray-500 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-md">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Signal
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Cognitive
          </div>
        </div>
      </div>

      {/* Horizontal Flow - Grid/Flex scrollable on small screens */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6 custom-scrollbar">
        <div className="flex items-stretch gap-4 min-w-[1050px]">
          {agents.map((agent, idx) => {
            const Icon = agent.icon;
            const isLast = idx === agents.length - 1;

            return (
              <div key={agent.id} className="flex-1 flex items-center">
                {/* Agent Card */}
                <div className={`flex-1 bg-slate-900/50 border rounded-xl p-4 flex flex-col justify-between transition duration-300 hover:scale-102 hover:border-cyan-400/35 relative group ${agent.glow}`}>
                  
                  {/* Glowing background anchor */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition duration-300 blur-md pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[8px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 tracking-wider font-semibold text-emerald-400 animate-pulse">
                        {agent.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-sans font-bold text-white tracking-tight">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                      {agent.role}
                    </p>
                    <p className="text-[10px] text-gray-500 font-sans mt-2 leading-relaxed">
                      {agent.desc}
                    </p>
                  </div>
                </div>

                {/* Animated Connector Arrow */}
                {!isLast && (
                  <div className="flex-shrink-0 px-2 flex flex-col items-center justify-center relative w-10">
                    <ArrowRight className="w-4 h-4 text-cyan-500/40 animate-pulse" />
                    {/* Pulsing signal bullet */}
                    <span className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-[ping_1.5s_infinite]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
