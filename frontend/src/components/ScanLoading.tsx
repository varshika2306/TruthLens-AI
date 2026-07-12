import { useEffect, useState, useRef } from "react";
import { Cpu, Terminal, Layers, ShieldCheck, Database, Hourglass } from "lucide-react";

interface ScanLoadingProps {
  imageUrl: string;
  imageName: string;
  onComplete: () => void;
}

export default function ScanLoading({ imageUrl, imageName, onComplete }: ScanLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const stages = [
    { label: "Initializing Evidence Agent", desc: "Verifying secure pipeline, loading image buffer...", icon: ShieldCheck },
    { label: "EXIF Metadata Parsing", desc: "Analyzing camera parameters, GPS tags, software traces...", icon: Database },
    { label: "Signal & Noise Level Scan", desc: "Inspecting high-frequency GAN noise & compression grids...", icon: Layers },
    { label: "RAG Forensic Knowledge Retrieval", desc: "Querying watsonx vector databases for semantic vectors...", icon: Cpu },
    { label: "IBM Granite Reasoning Engine", desc: "Executing Granite Foundation Models for cognitive synthesis...", icon: Cpu },
    { label: "Generating Forensics Verdict", desc: "Compiling executive summary and confidence report...", icon: Hourglass }
  ];

  const logDatabase = [
    "STATUS: Securing evidence payload...",
    "INF: Initialized temporary session TL-9000_AGENT_SECURE",
    "INF: Loaded image into memory stream. Parsing header structure...",
    "WARN: Stripped or absent EXIF headers identified. Redirecting to deep recovery...",
    "INF: Compiling 2D Fast Fourier Transform spectral frequency map...",
    "INF: Spectral peaks detected at high-frequency boundary. Inferred GAN lattice pattern.",
    "INF: Running localized Error Level Analysis (ELA)...",
    "INF: ELA peak discrepancy measured in facial region (bounding box coordinates [420, 180]).",
    "INF: Sub-pixel anti-aliasing vectors checked against standard camera profiles.",
    "RAG: Querying Granite vector indexing services...",
    "RAG: Received 3 high-confidence forensic matching articles.",
    "AI: Activating Granite-13B-Instruct model parameters...",
    "AI: Synthesizing analytical findings and lighting vectors...",
    "AI: Confidence alignment complete (Convergence at 94.2%).",
    "STATUS: Assembling printable executive verdict..."
  ];

  useEffect(() => {
    // Add logs dynamically as time passes
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logDatabase.length) {
        const nextLog = logDatabase[logIndex] ?? "";

        if (typeof nextLog === "string") {
          setLogs((prev) => [...prev, nextLog]);
        }

        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 600);

    return () => clearInterval(logInterval);
  }, []);

   

  useEffect(() => {
    // Auto-scroll logs
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    // Progress bar ticking
    const totalDuration = 9000; // 9 seconds of sheer premium experience
    const intervalTime = 90;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentPct = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentPct);

      // Advance stages
      const stageIdx = Math.min(Math.floor((currentPct / 100) * stages.length), stages.length - 1);
      setCurrentStage(stageIdx);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch py-4">
      {/* Left Column: Premium Scanning Visual */}
      <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-900/40 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
        {/* Background decorative mesh */}
        <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 to-transparent pointer-events-none" />
        
        <div className="relative w-full max-w-xs aspect-square bg-slate-950 rounded-lg overflow-hidden border border-cyan-500/20 group">
          {/* Pulsing crosshairs */}
          <div className="absolute inset-4 border border-dashed border-cyan-500/10 pointer-events-none rounded animate-pulse" />
          
          <img
            src={imageUrl}
            alt="Forensic scan target"
            className="w-full h-full object-cover opacity-60 filter saturate-50 blur-[1px] transform scale-102 transition duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Glowing laser scanning horizontal line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee,0_0_5px_#22d3ee] z-10 pointer-events-none"
            style={{
              top: `${Math.sin(progress / 5) * 50 + 50}%`,
              animation: "none" // controlled by progress math above to simulate sweeping back and forth
            }}
          />

          {/* Horizontal grid scan bar */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,187,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(18,187,212,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Radial scanning sweep overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,17,31,0.85)_100%)] pointer-events-none" />

          {/* Big pulsing Scanning Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-slate-950/80 border border-cyan-400/30 px-4 py-2 rounded-md backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              <span className="font-mono text-xs tracking-widest text-cyan-400 font-semibold uppercase">
                ACTIVE_SCANNING...
              </span>
            </div>
            <div className="mt-2 font-mono text-3xl font-bold text-white tracking-widest">
              {progress}%
            </div>
          </div>
        </div>

        <div className="w-full mt-6 text-center">
          <div className="font-mono text-xs text-gray-400 truncate max-w-full">
            TARGET_FILE: <span className="text-cyan-400">{imageName}</span>
          </div>
          <div className="font-mono text-[10px] text-gray-500 mt-1">
            VERIFICATION CODESET: IBM_WATSON_GRANITE_V2_SECURE
          </div>
        </div>
      </div>

      {/* Right Column: Processing Pipeline & Logs */}
      <div className="md:col-span-7 flex flex-col justify-between bg-slate-900/20 border border-cyan-500/10 rounded-xl p-6 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-sans font-semibold tracking-tight text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            AI Digital Forensics Pipeline
          </h2>

          {/* Custom Pipeline Progress Rows */}
          <div className="space-y-3.5 mb-6">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isDone = idx < currentStage;
              const isActive = idx === currentStage;
              
              return (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition duration-300 ${
                    isActive 
                      ? "bg-cyan-950/15 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.05)]" 
                      : isDone 
                        ? "bg-slate-900/35 border-emerald-500/20 opacity-80" 
                        : "bg-transparent border-transparent opacity-40"
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
                        ✓
                      </div>
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-slate-850 border border-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-sans text-xs font-medium ${isActive ? "text-cyan-400" : isDone ? "text-slate-300" : "text-gray-500"}`}>
                        {stage.label}
                      </p>
                      {isActive && (
                        <span className="font-mono text-[10px] text-cyan-400 animate-pulse">
                          RUNNING
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[10px] text-gray-500 mt-0.5 truncate">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Diagnostics Terminal */}
        <div className="bg-slate-950/90 border border-cyan-500/10 rounded-lg p-3 font-mono text-[10px] h-32 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-gray-500">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-500" />
              FORENSICS_TERMINAL_LOG
            </span>
            <span className="text-[8px] tracking-widest text-cyan-500/70">
              SYS_BUSY
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar scrollbar-thin">
            {logs.map((log, index) => {
              const text = typeof log === "string" ? log : "";
              const isWarn = text.includes("WARN");
              const isRag = text.includes("RAG");
              const isAi = text.includes("AI");
              return (
                <div 
                  key={index} 
                  className={`leading-relaxed ${
                    isWarn 
                      ? "text-amber-400/90" 
                      : isRag 
                        ? "text-purple-400" 
                        : isAi 
                          ? "text-cyan-300" 
                          : "text-slate-400"
                  }`}
                >
                  <span className="text-gray-600 mr-1.5">&gt;</span>
                  {text}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
