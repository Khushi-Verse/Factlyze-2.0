import { motion, AnimatePresence } from "motion/react";
import { Search, Trash2, ArrowRight } from "lucide-react";
import background from "../assets/background.jpeg";
export default function Home(props: any) {
  const {
    text,
    setText,
    url,
    setUrl,
    image,
    loading,
    result,
    error,
    handleAnalyze,
    handleClear,
    handleImageUpload,
    fileInputRef
  } = props;

  return (
    <section className="hero">
      
        <section className="hero pt-12 pb-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          See <span>beyond</span> the headlines.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Got news? Let's fact-check the vibes. <br />
          Drop a link,paste the text, or upload a snap.
        </motion.p>

        

        <div className="input-container">
          <div className="card">
            <h3>PASTE FULL ARTICLE & HEADLINE</h3>
            <textarea 
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the entire news story here including the headline..."
            />
          </div>

          <div className="input-row">
            <div className="card">
              <h3>OR PASTE LINK</h3>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#888]" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter article URL..."
                />
              </div>
            </div>
            <div className="card">
              <h3>OR SCAN IMAGE</h3>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*" 
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="cursor-pointer flex items-center justify-center border border-dashed border-[#555] rounded-lg p-3 text-[#888] hover:border-[#00f5ff] transition-all"
              >
                {image ? 'Image Selected' : 'Click to upload image'}
              </label>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleClear} className="clear-btn flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="detect-btn flex items-center gap-2"
          >
            {loading ? <span className="spinner"></span> : null}
            {loading ? 'Analyzing...' : 'Analyze News'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* ANALYSIS RESULTS */}
        <AnimatePresence>
          {result && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="analysis-grid"
  >      {/* Clickbait Score */}
              <div className="analysis-box">
                <h3>Clickbait Score</h3>
                <div className="text-3xl font-bold text-[#00f5ff]">{result.clickbait_score}%</div>
                <div className="bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.clickbait_score}%` }}
                    className="fill"
                  />
                </div>
                <p className="text-xs text-[#888] mt-3">Likelihood of sensationalized or misleading framing.</p>
              </div>

              {/* Bias Balance (Emotional vs Factual) */}
              <div className="analysis-box">
                <h3>Bias Balance (Factual vs Emotional)</h3>
                <div className="flex justify-between text-[10px] text-[#888] mb-1 uppercase tracking-widest font-bold">
                  <span>Factual</span>
                  <span>Emotional</span>
                </div>
                <div className="bar bg-[#00ffc3]/20">
                  <motion.div 
                    initial={{ width: "50%" }}
                    animate={{ width: `${result.bias_balance}%` }}
                    style={{ background: 'linear-gradient(90deg, #00ffc3)' }}
                    className="fill"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xl font-bold text-[#00ffc3]">{100 - result.bias_balance}%</div>
                 
                 <div className="text-xl font-bold text-[#ffa500]">{result.bias_balance}%</div>
                </div>
                <p className="text-xs text-[#888] mt-3">Balance between verifiable facts and subjective emotional triggers.</p>
              </div>

              {/* Emotions Detected */}
              <div className="analysis-box">
                <h3>Emotions Detected</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.emotions_detected.map((emotion, i) => (
                    <span key={i} className="px-3 py-1 bg-[#7b2ff7]/20 border border-[#7b2ff7]/40 rounded-full text-xs text-[#7b2ff7] font-semibold">
                      {emotion}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#888] mt-4">Primary psychological triggers identified in the text.</p>
              </div>

              {/* Key Takeaways */}
              <div className="analysis-card full-width">
                <h3>Key Takeaways</h3>
                <ul className="mt-4 space-y-3">
                  {result.key_takeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffc3] shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Annotated Article */}
              <div className="analysis-card full-width text-left">
                <h3>Annotated Analysis</h3>
                <div 
                  className="mt-4 leading-relaxed text-gray-300 text-left w-full max-w-none"
                  dangerouslySetInnerHTML={{ __html: result.annotated_article }}
                />
                <div className="mt-6 flex gap-4 text-[10px] uppercase tracking-wider font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Fear Trigger</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Anger Trigger</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span> Clickbait/Sensational</span>
                </div>
              </div>

              {/* Neutral Version */}
              <div className="analysis-card w-full">
                <h3>Neutral Perspective</h3>
                <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl italic text-gray-400 leading-relaxed">
                  "{result.neutral_version}"
                </div>
                <p className="text-xs text-[#888] mt-4">A bias-free reconstruction focusing strictly on verifiable events.</p>
              </div>

              {/* Related Coverage */}
              <div className="analysis-card full-width">
                <h3>Compare Coverage</h3>
                <div className="mt-4">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(result.comparison_query)}&tbm=nws`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detect-btn inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" /> Compare Across News Sources
                  </a>
                </div>
                <p className="text-xs text-[#888] mt-4">Cross-reference this story with other reputable news outlets via Google News search.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      
    </section>
    
  );

}
