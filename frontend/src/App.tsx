import React, { useState, useEffect, useRef } from "react";

import {
  Plus,
  Layers,
  History,
  BookOpen,
  FileText,
  Settings,
  Upload,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Database,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  Info
} from "lucide-react";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ForensicCanvas from "./components/ForensicCanvas";
import ScanLoading from "./components/ScanLoading";
import AgentWorkflow from "./components/AgentWorkflow";
import WatsonAssistant from "./components/WatsonAssistant";
import KnowledgeBase from "./components/KnowledgeBase";
import ReportView from "./components/ReportView";

// Types & Data
import {
  Investigation,
  ActiveTab,
  VisualFinding,
  ImageMetadata,
  KnowledgeItem,
  GraniteReasoning
} from "./types";

import { MOCK_INVESTIGATIONS } from "./data/mockInvestigations";
import { KNOWLEDGE_BASE_DATA } from "./components/KnowledgeBase";
import { investigateImage } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("TL-8204");
  const [dragOver, setDragOver] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "result">("idle");
  const [isNewScanAdded, setIsNewScanAdded] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState("IBM Granite-13B-Instruct (v2.6)");
  const [ragWeight, setRagWeight] = useState(0.85);
  const [isShieldActive, setIsShieldActive] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("truthlens_investigations");

    if (saved) {
      try {
        setInvestigations(JSON.parse(saved));
      } catch {
        setInvestigations(MOCK_INVESTIGATIONS);
      }
    } else {
      setInvestigations(MOCK_INVESTIGATIONS);
      localStorage.setItem("truthlens_investigations", JSON.stringify(MOCK_INVESTIGATIONS));
    }
  }, []);

  const saveInvestigations = (updatedList: Investigation[]) => {
    setInvestigations(updatedList);
    localStorage.setItem("truthlens_investigations", JSON.stringify(updatedList));
  };

  const activeCase = investigations.find((item: Investigation) => item.id === selectedCaseId) || investigations[0] || null;

  const getSafeString = (value: unknown, fallback = ""): string => {
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
  };

  const getSafeNumber = (value: unknown, fallback = 0): number => {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
  };

  const getSafeArray = <T,>(value: unknown, fallback: T[] = []): T[] => {
    return Array.isArray(value) ? value.filter((item): item is T => item != null) : fallback;
  };

  const getSafeObject = (value: unknown, fallback: Record<string, unknown> = {}): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : fallback;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Invalid file. Upload PNG/JPG/JPEG only.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadImage(reader.result);
        setSelectedFile(file);
        setUploadName(file.name);
        setScanState("scanning");
        setZoomScale(1);
        setIsNewScanAdded(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };


  const handleScanComplete = async () => {
    if (!selectedFile || !uploadImage) return;

    try {
      const response = await investigateImage(selectedFile);
      const normalizedResponse = getSafeObject(response as unknown as Record<string, unknown>);
      const verdict = getSafeObject(normalizedResponse.verdict, {});
      const metadataSource = getSafeObject(normalizedResponse.metadata, {});
      const reportSource = getSafeObject(normalizedResponse.ai_report, {});

      const riskLevel = getSafeString(verdict.risk_level).toUpperCase();
      const authenticityScore = getSafeNumber(verdict.authenticity_score, 0);
      const summary = getSafeString(
        verdict.summary,
        getSafeString(reportSource.summary, "Visual investigation completed.")
      );
      const severity = (riskLevel.toLowerCase() as "low" | "medium" | "high") || "low";

      const normalizedMetadata: ImageMetadata = {
        resolution: getSafeString(metadataSource.resolution),
        fileSize: getSafeString(metadataSource.fileSize),
        fileType: getSafeString(metadataSource.fileType),
        cameraModel: getSafeString(metadataSource.cameraModel),
        lensModel: getSafeString(metadataSource.lensModel),
        software: getSafeString(metadataSource.software),
        gpsCoordinates: getSafeString(metadataSource.gpsCoordinates),
        timestamp: getSafeString(metadataSource.timestamp),
        colorSpace: getSafeString(metadataSource.colorSpace),
      };

      const newCase: Investigation = {
        id: getSafeString(normalizedResponse.investigation_id, `INV-${Date.now()}`),
        title: `Investigation - ${getSafeString(uploadName, "Uploaded Evidence")}`,
        imageName: getSafeString(uploadName, "Uploaded Evidence"),
        imageUrl: getSafeString(uploadImage, ""),
        status: "completed",
        riskScore:
          riskLevel === "HIGH"
            ? 90
            : riskLevel === "MEDIUM"
            ? 60
            : 20,
        authenticityScore,
        confidence: authenticityScore,
        createdAt: getSafeString(normalizedResponse.completed_at, new Date().toISOString()),
        metadata: normalizedMetadata,
        visualFindings: [
          {
            id: `VF-${Date.now()}`,
            category: "artifacts",
            title: "Backend Visual Analysis",
            description: summary,
            severity,
            confidence: authenticityScore,
          },
        ],
        knowledgeBaseItems:
          Array.isArray(KNOWLEDGE_BASE_DATA) && KNOWLEDGE_BASE_DATA.length > 0
            ? [KNOWLEDGE_BASE_DATA[0]]
            : [],
        graniteReasoning: {
          summary,
          evidence: getSafeArray<string>(verdict.key_signals, []),
          confidenceExplanation: getSafeString(reportSource.confidenceExplanation, "Generated by IBM Granite AI."),
          recommendations: getSafeArray<string>(reportSource.recommendations, [
            "Review forensic report.",
            "Verify original image source.",
          ]),
        },
      };

      const updated = [newCase, ...investigations];

      saveInvestigations(updated);

      setSelectedCaseId(newCase.id);
      setScanState("result");
      setIsNewScanAdded(true);
    } catch (err) {
      console.error(err);

      alert("Investigation failed.");

      setScanState("idle");
    }
  };

  

  const handleResetToDemo = () => {
    saveInvestigations(MOCK_INVESTIGATIONS);
    setSelectedCaseId("TL-8204");
    setUploadImage(null);
    setUploadName("");
    setSelectedFile(null);
    setScanState("idle");
    setIsNewScanAdded(false);
    setZoomScale(1);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#040816] text-white">
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-1 flex-col">
          <Topbar activeTab={activeTab} />

          <main className="flex-1 overflow-auto p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
                          Threat Signal Overview
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-white">
                          AI-assisted forensic triage for image authenticity.
                        </h1>
                      </div>
                      <button
                        onClick={() => setActiveTab("investigate")}
                        className="rounded-lg border border-cyan-400/20 bg-cyan-950/30 px-4 py-2 text-sm text-cyan-300"
                      >
                        Begin Scan
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border border-cyan-500/10 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Active Cases</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{investigations.length}</p>
                      </div>
                      <div className="rounded-lg border border-cyan-500/10 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Shield Status</p>
                        <p className="mt-2 text-2xl font-semibold text-emerald-400">ONLINE</p>
                      </div>
                      <div className="rounded-lg border border-cyan-500/10 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Model</p>
                        <p className="mt-2 text-lg font-semibold text-white">{selectedModel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Forensic Mesh</h2>
                      <div className="flex items-center gap-2 text-xs text-cyan-400">
                        <ShieldCheck className="h-4 w-4" />
                        Secure Pipeline
                      </div>
                    </div>
                    <div className="mt-4 h-64">
                      <ForensicCanvas />
                    </div>
                  </div>
                </div>

                <AgentWorkflow />
              </div>
            )}

            {activeTab === "investigate" && (
              <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-6">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-cyan-400" />
                    <h1 className="text-2xl font-semibold text-white">Secure Evidence Intake</h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Upload a media sample to run the multi-agent forensic pipeline.
                  </p>

                  <label
                    className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition ${
                      dragOver ? "border-cyan-400 bg-cyan-950/20" : "border-cyan-500/20 bg-slate-950/40"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 text-cyan-400" />
                    <span className="mt-3 text-lg font-medium text-white">Drag and drop image here</span>
                    <span className="mt-1 text-sm text-gray-400">PNG, JPG, or JPEG only</span>
                    <span className="mt-4 rounded-lg bg-cyan-950/40 px-4 py-2 text-sm text-cyan-300">
                      Select File
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {uploadImage && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                      <div className="overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-950/60">
                        <img src={uploadImage} alt={uploadName} className="h-64 w-full object-cover" />
                      </div>
                      <div className="space-y-4 rounded-xl border border-cyan-500/10 bg-slate-950/60 p-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">File</p>
                          <p className="mt-1 text-sm text-white">{uploadName}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Status</p>
                          <p className="mt-1 text-sm text-cyan-300">
                            {scanState === "scanning" ? "Scanning" : scanState === "result" ? "Complete" : "Ready"}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-4 py-2 text-sm text-cyan-300"
                          >
                            Replace Image
                          </button>
                          <button
                            onClick={() => {
                              setScanState("scanning");
                              setIsNewScanAdded(false);
                            }}
                            className="rounded-lg border border-cyan-500/20 bg-slate-900 px-4 py-2 text-sm text-white"
                          >
                            Run Inspection
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {scanState === "scanning" && uploadImage && (
                  <ScanLoading imageUrl={uploadImage} imageName={uploadName} onComplete={handleScanComplete} />
                )}

                {scanState === "result" && activeCase && (
                  <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">Investigation Result</p>
                        <h2 className="mt-2 text-xl font-semibold text-white">{activeCase.title}</h2>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-sm text-emerald-400">
                        {activeCase.riskScore}% risk
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      The inspection pipeline completed and the report is ready for review.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                  <History className="text-cyan-400" />
                  Investigation History
                </h1>

                <div className="space-y-4">
                  {investigations.map((item) => (
                    <div key={item.id} className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-5">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="mt-1 font-mono text-xs text-gray-400">{item.id}</p>
                        </div>
                        <span className="font-bold text-cyan-400">{item.riskScore}%</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCaseId(item.id);
                          setScanState("result");
                          setActiveTab("investigate");
                        }}
                        className="mt-4 text-xs text-cyan-400"
                      >
                        OPEN REPORT →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "knowledge" && (
              <div className="mx-auto max-w-4xl">
                <KnowledgeBase />
              </div>
            )}

            {activeTab === "reports" && (
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5">
                  <h2 className="flex items-center gap-2 font-bold">
                    <FileText className="text-cyan-400" />
                    Executive Reports
                  </h2>

                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="mt-4 w-full rounded-lg border border-cyan-500/20 bg-slate-950 p-2"
                  >
                    {investigations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {activeCase && <ReportView investigation={activeCase} />}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                  <Settings className="text-cyan-400" />
                  System Settings
                </h1>

                <div className="space-y-5 rounded-xl border border-cyan-500/20 bg-slate-900/40 p-6">
                  <div>
                    <label className="text-xs text-gray-400">Granite Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="mt-2 w-full rounded-lg border bg-slate-950 p-2"
                    >
                      <option>IBM Granite-13B-Instruct</option>
                      <option>IBM Granite-20B</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">RAG Weight: {ragWeight}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={ragWeight}
                      onChange={(e) => setRagWeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <button onClick={handleResetToDemo} className="rounded-lg bg-red-600 px-4 py-2 text-sm">
                    Reset Demo Data
                  </button>
                </div>
              </div>
            )}
          </main>

          <WatsonAssistant activeCase={activeCase} />
        </div>
      </div>
    </div>
  );
}
