import { Routes, Route, Link } from "react-router-dom";
import Hero from "./pages/Hero";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import FAQ from "./pages/FAQ.tsx";

import { useState, useRef } from 'react';
import { Info, HelpCircle, Shield } from 'lucide-react';
import logo from './assets/logo.png';
import background from './assets/background.jpeg';
interface AnalysisResult {
  clickbait_score: number;
  bias_balance: number; // 0 (Factual) to 100 (Emotional)
  emotions_detected: string[];
  annotated_article: string;
  neutral_version: string;
  key_takeaways: string[];
  comparison_query: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const apiKey=import.meta.env.VITE_GEMINI_API_KEY;
  //console.log("My API Key is:",import.meta.env.VITE_GEMINI_API_KEY);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
  if (!text && !url && !image) {
    setError('Please provide an article, a link, or an image to analyze.');
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        url,
        image,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed");
    }

    setResult(data);
  } catch (err: any) {
    console.error("Analysis error:", err);
    setError(err.message || "An error occurred during analysis.");
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setText('');
    setUrl('');
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
  className="min-h-screen font-sans"
  style={{
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }}
>
      {/* NAVBAR */}
      <nav className="navbar">
  <div className="flex items-center gap-3">
    <img src={logo} alt="Factalyze Logo" className="logo-img" />
    <span className="text-xl font-semibold tracking-wide">Factalyze</span>
  </div>

  <div className="flex items-center gap-10 text-sm font-medium text-gray-300">
  <Link to="/home" className="hover:text-[#00ffc3] transition">Home</Link>
  <Link to="/about" className="hover:text-[#00ffc3] transition">About</Link>
  <Link to="/faq" className="hover:text-[#00ffc3] transition">FAQ</Link>
</div>
</nav>
<Routes>
  <Route path="/" element={<Hero />} />
  <Route
  path="/home"
  element={
    <Home
      text={text}
      setText={setText}
      url={url}
      setUrl={setUrl}
      image={image}
      loading={loading}
      result={result}
      error={error}
      handleAnalyze={handleAnalyze}
      handleClear={handleClear}
      handleImageUpload={handleImageUpload}
      fileInputRef={fileInputRef}
    />
  }
/>
  <Route path="/about" element={<About />} />
  <Route path="/faq" element={<FAQ />} />
</Routes>

      {/* HERO */}
      

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <Shield className="w-10 h-10 text-[#00ffc3] mx-auto mb-4" />
          <h4>Identify Clickbait</h4>
          <p>Expose headlines designed to manipulate emotions rather than inform with our advanced scoring system.</p>
        </div>

        <div className="feature">
          <Info className="w-10 h-10 text-[#00ffc3] mx-auto mb-4" />
          <h4>Neutralize Bias</h4>
          <p>Extract the real facts from heavily skewed or ideologically loaded reporting using AI reconstruction.</p>
        </div>

        <div className="feature">
          <HelpCircle className="w-10 h-10 text-[#00ffc3] mx-auto mb-4" />
          <h4>Verify Sources</h4>
          <p>Instantly find related coverage to see how different outlets frame the same story across the spectrum.</p>
        </div>
      </section>

      <footer className="p-10 text-center text-[#555] text-sm border-t border-white/5">
        &copy; 2026 Factalyze News Intelligence. All rights reserved.
      </footer>
    </div>
  );
}
