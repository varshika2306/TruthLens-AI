import { useState } from "react";
import { BookOpen, Search, ChevronDown, ChevronUp, Database, ExternalLink, ShieldCheck } from "lucide-react";
import { KnowledgeItem } from "../types";

export const KNOWLEDGE_BASE_DATA: KnowledgeItem[] = [
  {
    id: "KB-101",
    title: "Facial Synthetics & GAN Signature Analysis",
    description: "Generative models produce systematic grid patterns in deep convolutional layers due to transposed convolution operations (up-sampling). These footprints show up as distinct spectral peaks in the 2D Fourier power spectrum, proving synthetic origins.",
    source: "IBM watsonx.ai Security Research Group (Ref: SD-2025-X)",
    confidence: 99,
    retrievedAt: "2026-07-06T14:22:16-07:00",
    category: "deepfake"
  },
  {
    id: "KB-102",
    title: "JPEG Quantization Discrepancy (Double Compression)",
    description: "When an image region is tampered with and re-saved, that region goes through a secondary compression cycle. This creates localized block-level quantization anomalies that deviate from the background DCT (Discrete Cosine Transform) matrix.",
    source: "Granite Forensics RAG Index / IEEE Signal Processing Library",
    confidence: 94,
    retrievedAt: "2026-07-06T14:22:16-07:00",
    category: "compression"
  },
  {
    id: "KB-103",
    title: "Biometric Inconsistencies in Deep Generative Media",
    description: "Generative adversarial networks and diffusion models fail to accurately align facial lighting vectors with environmental context. Additionally, pupil boundaries in synthetic irises often show asymmetric pixelation and physically impossible highlights.",
    source: "DARPA MediFor Project Documentation Archive",
    confidence: 91,
    retrievedAt: "2026-07-06T14:22:17-07:00",
    category: "lighting"
  },
  {
    id: "KB-104",
    title: "Metadata Inconsistencies in Financial Instruments",
    description: "Authentic financial systems print documents directly with uniform raster fonts. Digital modifications in SWIFT or wire transfer slips leave software trail signatures such as 'Adobe Photoshop' inside the header metadata, indicating post-render edits.",
    source: "IBM Watson Financial Forensics Toolkit",
    confidence: 98,
    retrievedAt: "2026-07-05T09:11:44-07:00",
    category: "metadata"
  },
  {
    id: "KB-105",
    title: "Copy-Move Forgery Detection (CMFD)",
    description: "Copy-Move Forgery involves copying a block of pixels to another location in the same image (e.g. clone-stamping out details). These are detected by computing local Scale-Invariant Feature Transform (SIFT) descriptors and matching vector offsets.",
    source: "Granite Forensics RAG / Journal of Forensic Sciences",
    confidence: 93,
    retrievedAt: "2026-07-05T09:11:45-07:00",
    category: "artifacts"
  },
  {
    id: "KB-106",
    title: "Camera Sensor Noise Fingerprints (PRNU)",
    description: "Photo-Response Non-Uniformity (PRNU) represents an invisible, unique noise fingerprint left by silicon sensor imperfections. Authentic photographs exhibit an unbroken PRNU coat, whereas synthetic generations contain a highly structured artificial noise floor.",
    source: "IEEE Transactions on Information Forensics and Security",
    confidence: 98,
    retrievedAt: "2026-07-04T07:45:02-07:00",
    category: "metadata"
  },
  {
    id: "KB-107",
    title: "EXIF Structure & Forensic Header Scrubbing",
    description: "Legitimate hardware cameras write systematic EXIF blocks including lens aperture, software firmware, and exact chronological tags. The complete stripping or mismatch of standard EXIF directories signals deliberate metadata scrubbing.",
    source: "ISO 12234-2 Photo Standards Committee",
    confidence: 95,
    retrievedAt: "2026-07-03T11:20:00-07:00",
    category: "metadata"
  },
  {
    id: "KB-108",
    title: "Diffusion Model Checkerboard Artifacts",
    description: "Latent Diffusion Models (LDM) typically leave telltale high-frequency artifacts during the reverse denoising process. These manifests as localized grids of high-frequency energy density visible under specialized Wavelet decomposition transforms.",
    source: "MIT-IBM Watson AI Lab (Ref: DIFF-2026)",
    confidence: 92,
    retrievedAt: "2026-07-02T16:40:11-07:00",
    category: "deepfake"
  }
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "KB-101": true, // open first by default
    "KB-102": true
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { value: "all", label: "All Databases" },
    { value: "metadata", label: "Metadata & Headers" },
    { value: "compression", label: "Compression & Noise" },
    { value: "lighting", label: "Lighting & Biometrics" },
    { value: "deepfake", label: "Synthetic AI & deepfakes" }
  ];

  const filteredItems = KNOWLEDGE_BASE_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          RAG Forensic Knowledge Base
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore and query verified security journals, research papers, and deepfake fingerprint databases loaded in the watsonx index.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forensic topics, vector indices, signatures..."
            className="w-full bg-[#091322] border border-cyan-500/15 focus:border-cyan-400/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/25"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="md:col-span-5 flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs font-sans px-3 py-2 rounded-lg border transition duration-200 ${
                selectedCategory === cat.value
                  ? "bg-cyan-950/40 border-cyan-400/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900/40 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Item Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isExpanded = !!expandedItems[item.id];
            return (
              <div
                key={item.id}
                className={`bg-slate-900/30 border rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded 
                    ? "border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.05)] bg-[#0c1a2f]/40" 
                    : "border-slate-850 hover:border-slate-750"
                }`}
              >
                {/* Header clickable summary */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-cyan-400">
                      <Database className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-400 tracking-wider border border-cyan-500/10">
                          {item.id}
                        </span>
                        <span className="text-xs text-gray-400 font-mono tracking-wider capitalize">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1 hover:text-cyan-400 transition">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <div className="text-[10px] text-gray-500 font-mono">CONFIDENCE INDEX</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                        {item.confidence}%
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 bg-slate-950/20 animate-slide-down">
                    <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl mt-2">
                      {item.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-850 text-[10px] font-mono text-gray-500">
                      <div>
                        SOURCE SYSTEM:{" "}
                        <span className="text-gray-300 flex items-center gap-1 mt-1 font-sans">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          {item.source}
                        </span>
                      </div>
                      <div>
                        RAG_RETRIEVAL_TIMESTAMP:{" "}
                        <span className="text-gray-300 block mt-1">
                          {new Date(item.retrievedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-900/10 border border-slate-850 rounded-xl">
            <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No matching digital forensics entries found.</p>
            <p className="text-xs text-gray-600 mt-1">Try refining your search text or switching databases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
