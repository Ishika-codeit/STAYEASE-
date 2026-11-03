import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, MapPin, ArrowRight } from "lucide-react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (isAiMode && aiPrompt.trim()) {
      navigate(`/search?smartPrompt=${encodeURIComponent(aiPrompt.trim())}`);
    } else {
      const params = new URLSearchParams();
      if (location.trim()) params.append("location", location.trim());
      if (category) params.append("category", category);
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="w-[90%] md:w-[75%] max-w-5xl mx-auto -mt-10 relative z-30">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-3">
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg border border-gray-200 flex gap-1">
          <button
            type="button"
            onClick={() => setIsAiMode(false)}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
              !isAiMode
                ? "bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Standard Search
          </button>
          <button
            type="button"
            onClick={() => setIsAiMode(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
              isAiMode
                ? "bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
            Natural AI Search
          </button>
        </div>
      </div>

      {/* Main Search Container */}
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-xl border border-white/60 p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4"
      >
        {!isAiMode ? (
          <>
            {/* Location Input */}
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Search by city (e.g. Varanasi, Kota, Delhi...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 pl-12 pr-4 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] placeholder:text-gray-400 font-medium text-sm md:text-base"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00CEC9] w-5 h-5" />
            </div>

            {/* Category Select */}
            <div className="w-full md:w-5/12">
              <select
                title="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00CEC9] font-medium text-sm md:text-base cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Student PG / Hostel">Student PG / Hostel</option>
                <option value="Tourist Stay">Tourist Stay</option>
                <option value="Coaching Stay">Coaching Stay</option>
                <option value="Parking Space">Parking Space</option>
                <option value="Short Stay">Short Stay</option>
                <option value="Monthly Rooms">Monthly Rooms</option>
              </select>
            </div>
          </>
        ) : (
          /* AI Natural Language Prompt Input */
          <div className="w-full relative">
            <input
              type="text"
              placeholder="e.g. 'cheap student pg near BHU with wifi and AC under 5000' or 'parking in Lucknow'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-4 pl-12 pr-4 rounded-2xl bg-purple-50/60 text-gray-900 border-2 border-[#6C5CE7]/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] placeholder:text-gray-400 font-medium text-sm md:text-base"
            />
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7] w-5 h-5" />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Search className="w-4 h-4 text-black" />
          <span>{isAiMode ? "Smart Search" : "Search Now"}</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
