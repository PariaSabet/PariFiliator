import { useState } from "react";

// TODO: Replace with your actual Amazon Associate tag
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

      if (!url.hostname.includes("amazon")) {
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
      <div
      // className="relative w-[450px] h-[600px] rounded-[30px] flex justify-center items-center shadow-2xl overflow-hidden"
      >
        {/* Circles */}
        {/* <div 
          className="absolute rounded-full top-[40px] left-[60px] w-[150px] h-[150px]"
          style={{ background: 'linear-gradient(to top right, #a20434, #f7bb9c)' }}
        />
        <div 
          className="absolute rounded-full top-[200px] right-[30px] w-[230px] h-[230px]"
          style={{ background: 'linear-gradient(to top right, #38594b 50%, #e1a4b3 85%)' }}
        />
        <div 
          className="absolute rounded-full bottom-[80px] left-[105px] w-[125px] h-[125px]"
          style={{ background: 'linear-gradient(to top right, #f65a45, #ffc7c0)' }}
        /> */}

        {/* Content - .content */}
        <div className="relative z-10 w-[280px] h-[480px] bg-white/15 rounded-[15px] border border-white/25 shadow-[0_4px_6px_rgba(0,0,0,0.1)] backdrop-blur-[30px] flex flex-col items-center pt-8 pb-4 px-4">
          {/* Heading Section */}
          <div className="w-full flex flex-col items-center mb-10">
            <h1 className="text-outline font-poppins text-[42px] leading-tight tracking-[-2px] m-0">
              Pariffiliator
            </h1>
            {/* <div className="w-[150%] h-px border-t border-white/50 -mt-[5px]" /> */}
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
                  <div className="text-white/90 text-[10px] font-karla break-all line-clamp-2">
                    {generatedLink}
                  </div>
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

          {/* Glass Label Footer - .glass */}
          {/* <div className="w-[85%] bg-white/35 rounded-[15px] py-1 shadow-[0_10px_15px_rgba(0,0,0,0.15)] mt-auto mb-2 flex justify-center items-center">
            <p className="font-karla text-white text-[18px] transform scale-y-[0.65] m-0 tracking-wider">
              PARIFFILIATOR
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
