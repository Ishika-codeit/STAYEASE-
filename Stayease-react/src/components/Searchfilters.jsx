import React from "react";
import { Search, Sparkles, Filter, SlidersHorizontal, RotateCcw } from "lucide-react";

const Searchfilters = ({
  category,
  setCategory,
  budget,
  setBudget,
  location,
  setLocation,
  roomType,
  setRoomType,
  sort,
  setSort,
  isSmartMode,
  setIsSmartMode,
  smartPrompt,
  setSmartPrompt,
  onSmartSearch,
  onResetFilters,
}) => {
  return (
    <section className="w-full px-6 pt-28 pb-8 bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent mb-3">
            Find Your Ideal Stay
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Search verified student PGs, tourist hotels, private rooms, and secure parking.
          </p>

          {/* AI Search Mode Toggle Pill */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsSmartMode(!isSmartMode)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-bold border transition shadow-sm ${
                isSmartMode
                  ? "bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black border-transparent shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#6C5CE7]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span>{isSmartMode ? "✨ AI Smart Search Active" : "Try Natural Language AI Search"}</span>
            </button>
          </div>
        </div>

        {/* Filter Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 space-y-4">
          {isSmartMode ? (
            /* AI Natural Search Input */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSmartSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. 'cheap student pg near BHU with wifi and AC under 5000' or 'parking in Hazratganj'"
                  value={smartPrompt}
                  onChange={(e) => setSmartPrompt(e.target.value)}
                  className="w-full p-4 pl-12 rounded-2xl bg-purple-50/50 border-2 border-[#6C5CE7]/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] font-medium text-sm md:text-base text-gray-800"
                />
                <Sparkles className="w-5 h-5 text-[#6C5CE7] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold shadow-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-black" />
                <span>Search with AI</span>
              </button>
            </form>
          ) : (
            /* Standard Grid Filters */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="City, area or address..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Student PG / Hostel">Student PG / Hostel</option>
                    <option value="Tourist Stay">Tourist Stay</option>
                    <option value="Coaching Stay">Coaching Stay</option>
                    <option value="Short Stay">Short Stay</option>
                    <option value="Parking Space">Parking Space</option>
                    <option value="Monthly Rooms">Monthly Rooms</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium bg-white"
                  >
                    <option value="All">All Budgets</option>
                    <option value="below500">Below ₹500</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="1000-3000">₹1,000 - ₹3,000</option>
                    <option value="above3000">Above ₹3,000</option>
                  </select>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium bg-white"
                  >
                    <option value="All">All Room Types</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Covered Parking">Covered Parking</option>
                  </select>
                </div>
              </div>

              {/* Sorting & Reset Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Sort By:
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition py-1 px-2.5 rounded-lg hover:bg-gray-100"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Searchfilters;