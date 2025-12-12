import { useState } from "react";

const AFFILIATE_TAG = "pariasabet09-20";

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const shortenUrl = async (url: string) => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
      );
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.error("Shortening failed", e);
    }
    return url;
  };

  const generateLink = async () => {
    setError("");
    setGeneratedLink("");
    setCopied(false);
    setLoading(true);

    if (!inputUrl.trim()) {
      setError("Enter URL");
      setLoading(false);
      return;
    }

    try {
      let urlStr = inputUrl.trim();
      if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
        urlStr = "https://" + urlStr;
      }

      const url = new URL(urlStr);

      if (
        !url.hostname.includes("amazon") &&
        !["a.co", "amzn.to"].includes(url.hostname)
      ) {
        setError("Not an Amazon URL");
        setLoading(false);
        return;
      }

      // Try to extract ASIN for a cleaner link
      const asinMatch = url.pathname.match(
        /(?:\/dp\/|\/gp\/product\/)([a-zA-Z0-9]{10})/
      );

      let cleanUrl = "";

      if (asinMatch && asinMatch[1]) {
        // Clean link with ASIN
        const asin = asinMatch[1];
        cleanUrl = `https://${url.hostname}/dp/${asin}?tag=${AFFILIATE_TAG}`;
      } else {
        // Fallback: Just update/add the tag parameter to the existing URL
        url.searchParams.set("tag", AFFILIATE_TAG);
        url.searchParams.delete("ref");
        url.searchParams.delete("ref_");
        cleanUrl = url.toString();
      }

      const shortLink = await shortenUrl(cleanUrl);
      setGeneratedLink(shortLink);
    } catch (e) {
      setError("Invalid URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-50"
      style={{
        background:
          "linear-gradient(to top right, #075265 0%, #ADA7BD 50%, #D5B7BB 75%, #F6BBB3 100%)",
      }}
    >
      {/* Container - .container */}
      <div>

        {/* Content - .content */}
        <div className="relative z-10 w-[280px] h-[480px] bg-white/15 rounded-[15px] border border-white/25 shadow-[0_4px_6px_rgba(0,0,0,0.1)] backdrop-blur-[30px] flex flex-col items-center pt-8 pb-4 px-4">
          {/* Heading Section */}
          <div className="w-full flex flex-col items-center mb-10">
            <h1 className="text-outline font-poppins text-[42px] leading-tight tracking-[-2px] m-0">
              Pariffiliator
            </h1>
          </div>

          {/* Form Area (Replacing empty space) */}
          <div className="w-full flex-1 flex flex-col items-center gap-4 w-[90%]">
            <input
              type="text"
              placeholder="Paste Amazon link..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  generateLink();
                }
              }}
              className="w-full h-10 bg-white/20 border border-white/30 rounded-lg px-3 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 font-karla text-sm"
            />

            <button
              onClick={generateLink}
              disabled={loading}
              className={`w-full py-2 bg-white/30 hover:bg-white/40 border border-white/30 rounded-lg text-white font-karla font-bold tracking-wide transition-all text-sm shadow-sm ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "GENERATING..." : "GENERATE"}
            </button>

            {error && (
              <div className="text-red-100 bg-red-500/20 px-2 py-1 rounded text-xs font-karla">
                {error}
              </div>
            )}

            {generatedLink && (
              <div className="w-full mt-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white/20 border border-white/30 rounded-lg p-2 flex flex-col gap-2">
                  <a 
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 text-[10px] font-karla break-all line-clamp-2 hover:text-white hover:underline transition-colors text-center"
                  >
                    {generatedLink}
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="w-full py-1 bg-white/40 hover:bg-white/50 rounded text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
