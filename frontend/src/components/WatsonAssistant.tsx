import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Cpu, Sparkles, HelpCircle } from "lucide-react";
import { Investigation } from "../types";

interface WatsonAssistantProps {
  activeCase: Investigation | null;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function WatsonAssistant({ activeCase }: WatsonAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting based on the selected case
  useEffect(() => {
    const greetingText = activeCase
      ? `Watson Forensics Assistant online. I am loaded with the context of Case ${activeCase.id} (${activeCase.title}). You can ask me to analyze specific visual findings, explain the EXIF anomalies, or suggest field remediation steps. How can I assist your investigation?`
      : "Watson Forensics Assistant online. Accessing cognitive libraries for watsonx.ai. Select an active investigation or upload digital media, and I can walk you through Fourier anomalies, metadata integrity, or Granite Reasoning summaries.";

    setMessages([
      {
        id: "greet-1",
        sender: "assistant",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeCase]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate Watson's cognitive response based on keywords
    setTimeout(() => {
      let replyText = "";
      const query = text.toLowerCase();

      if (query.includes("exif") || query.includes("metadata")) {
        replyText = "EXIF (Exchangeable Image File Format) contains critical parameters recorded directly by camera firmware. In professional forensics, a complete absence of these tags (camera model, software, GPS) is a heavy anomaly. Furthermore, if the software flag says 'Adobe Photoshop' on an official SWIFT transaction slip (like in Case TL-7491), it mathematically proves external software rendering occurred.";
      } else if (query.includes("suspicious") || query.includes("tl-8204") || query.includes("deepfake")) {
        replyText = "Case TL-8204 exhibits severe Generative Adversarial Network (GAN) footprints. Generative networks leave a periodic repeating lattice noise structure (visible as frequency peaks under 2D Fourier transforms). In addition, the facial lighting vectors do not match the background scenery, and the iris reflection is physically impossible. This points to a highly advanced face-swap or synthetic generation.";
      } else if (query.includes("compression") || query.includes("ela") || query.includes("double")) {
        replyText = "Error Level Analysis (ELA) identifies differences in JPEG compression levels. Standard cameras compress images uniformly. If an editor overlay is saved, those pixels are compressed twice. This double JPEG compression shifts the local discrete cosine transform (DCT) coefficients, causing those regions to stand out in high-contrast ELA scans.";
      } else if (query.includes("granite")) {
        replyText = "IBM Granite-13B-Instruct is fine-tuned for high-security digital investigations. It parses structured biometric, noise, and metadata findings, compiles conflicting vector points (such as lighting angle discrepancies vs physical coordinates), and outputs logical, legally-defensible evidence narratives.";
      } else if (activeCase) {
        replyText = `Regarding Case ${activeCase.id}, the current risk metric is calibrated at ${activeCase.riskScore}%. The highest threat vector lies in our ${activeCase.visualFindings[0]?.title || "signal analysis"}. I suggest checking the Retrieved Knowledge Base articles below for industry-standard validation of these anomalies.`;
      } else {
        replyText = "I have indexed the forensic library. I can assist with queries on: \n1. Camera Sensor Fingerprints (PRNU)\n2. Localized Error Level Analysis (ELA)\n3. Double JPEG quantization tables\n4. IBM Granite reasoning logic. Please specify an index to query.";
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestions = activeCase
    ? [
        { label: "Why is this suspicious?", value: `Why is this suspicious and what is the threat vector of Case ${activeCase.id}?` },
        { label: "Explain missing EXIF", value: "Why is missing or manipulated EXIF metadata suspicious in digital forensics?" },
        { label: "How does ELA work?", value: "How does Error Level Analysis (ELA) identify edited image layers?" }
      ]
    : [
        { label: "Can AI images contain metadata?", value: "Can AI-generated images contain standard camera metadata?" },
        { label: "What are GAN noise patterns?", value: "What are GAN high-frequency noise patterns?" },
        { label: "How does Watson integrate?", value: "How does IBM Watson Assistant coordinate with Granite Reasoning models?" }
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Closed Button */}
      {!isOpen && (
        <button
          id="btn-watson-toggle-open"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/20 transition duration-300 hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></span>
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase font-mono">
            Watson Forensic Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          id="watson-chat-panel"
          className="w-80 sm:w-96 h-[500px] bg-[#0c1a2f]/90 border border-cyan-400/30 rounded-2xl shadow-[0_10px_40px_rgba(8,17,31,0.9),0_0_30px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden backdrop-blur-xl animate-fade-in"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 to-[#0e1d33] border-b border-cyan-500/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-950 rounded-lg border border-cyan-500/30 text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide font-mono">
                    WATSON_COPILOT
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans">
                  Forensic Intelligence Assistant
                </p>
              </div>
            </div>
            <button
              id="btn-watson-toggle-close"
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white hover:bg-slate-900 rounded-lg transition duration-250"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin custom-scrollbar bg-slate-950/10">
            {messages.map((msg) => {
              const isAssistant = msg.sender === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed font-sans ${
                    isAssistant
                      ? "bg-[#10233e]/80 text-slate-100 border border-slate-800 rounded-tl-none shadow-[2px_2px_12px_rgba(0,0,0,0.15)]"
                      : "bg-cyan-600 text-white rounded-tr-none shadow-[2px_2px_12px_rgba(6,182,212,0.1)]"
                  }`}>
                    {/* Preserve linebreaks */}
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-[8px] mt-1.5 font-mono text-right ${isAssistant ? "text-cyan-500/55" : "text-cyan-100/60"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#10233e]/80 border border-slate-800 text-slate-100 rounded-xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 border-t border-cyan-500/5 bg-slate-950/20 flex flex-wrap gap-1.5">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.value)}
                className="text-[10px] font-sans font-medium text-cyan-400 hover:text-white bg-cyan-950/30 hover:bg-cyan-950/65 border border-cyan-500/20 rounded-md px-2.5 py-1 text-left transition duration-200"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-slate-950/60 border-t border-cyan-500/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Watson Assistant..."
              className="flex-1 bg-[#091322] border border-cyan-500/15 focus:border-cyan-400/50 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/25 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-900 disabled:text-gray-600 text-white rounded-lg transition duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
