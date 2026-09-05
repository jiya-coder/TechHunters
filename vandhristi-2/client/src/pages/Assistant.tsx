import { useRef, useState } from "react";
import { Activity, Bot, Mic, Send, Sparkles, Trees } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

type Theme = "morning" | "dusk";
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

const fallbackReply = "I’ve noted that. In this prototype, try asking about delayed claims, a district review workflow, or a spatial mismatch.";

export default function Assistant() {
  const [theme, setTheme] = useState<Theme>("dusk");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Namaste. I’m VanRakshak AI. Ask me about a claim, a workflow, or a map anomaly." }]);
  const recognitionRef = useRef<Recognition | null>(null);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const respond = async (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((items) => [...items, { from: "user", text: clean }]);
    setInput("");

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });
      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || fallbackReply;
        setMessages((items) => [...items, { from: "bot", text: replyText }]);
        speak(replyText.slice(0, 200));
        return;
      }
    } catch {
      // ignore
    }

    setMessages((items) => [...items, { from: "bot", text: fallbackReply }]);
    speak(fallbackReply);
  };


  const startVoice = () => {
    if (listening) {
      recognitionRef.current?.onend?.();
      recognitionRef.current = null;
      setListening(false);
      return;
    }
    const speechWindow = window as SpeechWindow;
    const RecognitionConstructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!RecognitionConstructor) {
      const message = "Voice input is not available in this browser. You can still use the text assistant below.";
      setMessages((items) => [...items, { from: "bot", text: message }]);
      speak(message);
      return;
    }
    const recognition = new RecognitionConstructor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const resultEvent = event as { results: ArrayLike<{ 0: { transcript: string } }> };
      const transcript = resultEvent.results[0]?.[0]?.transcript || "";
      setListening(false);
      respond(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      const message = "I couldn’t hear that clearly. Try again, or type your question below.";
      setMessages((items) => [...items, { from: "bot", text: message }]);
      speak(message);
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return <div className={`site-shell page-shell ${theme === "dusk" ? "theme-dusk" : "theme-morning"}`}><SiteHeader theme={theme} onToggleTheme={() => setTheme(theme === "morning" ? "dusk" : "morning")} /><main className="inner-page assistant-page"><div className="container assistant-page-grid"><div className="assistant-page-copy"><span className="eyebrow">04 / Decision intelligence</span><h1>Ask the<br /><em>landscape.</em></h1><p>VanRakshak AI helps district officials review claims, explain procedures, and interpret signals from the map.</p><div className="assistant-prompt-list"><span><Sparkles size={14} /> Explain a flagged claim</span><span><Sparkles size={14} /> Review the FRA process</span><span><Sparkles size={14} /> Interpret a spatial mismatch</span></div></div><div className="assistant-page-card glass-panel"><div className="assistant-head"><div className="assistant-title"><span className="assistant-avatar"><Bot size={17} /></span><div><b>VanRakshak AI</b><small><span className="live-dot" /> FRA intelligence layer</small></div></div><span className="assistant-page-status">{listening ? "LISTENING" : "READY"}</span></div><div className="assistant-context"><Sparkles size={13} /> Voice-ready · Hindi/English browser input</div><div className="chat-thread chat-thread-large">{messages.map((message, index) => <div className={`chat-bubble ${message.from}`} key={`${message.text}-${index}`}>{message.text}</div>)}{listening && <div className="chat-bubble bot"><span className="speaking-bars"><i /><i /><i /><i /></span> Listening for your question…</div>}</div><div className="chat-compose"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && respond(input)} placeholder="Ask about a claim or anomaly…" /><button onClick={() => respond(input)} aria-label="Send message"><Send size={15} /></button></div><button className={`assistant-voice-button ${listening ? "listening" : ""}`} onClick={startVoice}>{listening ? <Activity size={17} /> : <Mic size={17} />} {listening ? "Listening — tap to stop" : "Start voice assistant"}</button></div></div></main><footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><Trees size={18} /></span><span><b>VanRakshak</b><small>Empowering forest rights through intelligence.</small></span></div><span className="footer-credit">Designed & developed by <b>Team TeachHunters</b></span></div></footer></div>;
}
