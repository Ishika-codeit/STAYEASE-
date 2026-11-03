import React from "react";
import ListingCard from "./ListingCard";
import { Sparkles, Home, RotateCcw } from "lucide-react";

const Searchresult = ({ listings = [], loading = false, detectedCriteria = null, onReset }) => {
  return (
    <section className="w-full px-6 py-12 bg-gray-50 min-h-[500px]">
      <div className="max-w-6xl mx-auto">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Available Accommodations
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Showing <span className="font-bold text-[#6C5CE7]">{listings.length}</span> verified spaces
            </p>
          </div>

          {/* AI Criteria Badge if natural search was performed */}
          {detectedCriteria && Object.keys(detectedCriteria).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs">
              <span className="font-bold text-[#6C5CE7] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Parsed:
              </span>
              {Object.entries(detectedCriteria).map(([k, v]) => (
                <span
                  key={k}
                  className="bg-white px-2.5 py-1 rounded-full font-semibold text-gray-700 border border-purple-100 shadow-2xs"
                >
                  {k}: {Array.isArray(v) ? v.join(", ") : String(v)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-96 p-4 border border-gray-100 shadow-md animate-pulse space-y-4"
              >
                <div className="w-full h-48 bg-gray-200 rounded-2xl" />
                <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-6" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-xl mx-auto border border-gray-100 my-8">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#6C5CE7] mx-auto flex items-center justify-center text-3xl mb-4">
              🏠
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stays Found</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              We couldn't find any listings matching your specific criteria. Try adjusting your
              filters, broadening your budget, or search another city.
            </p>
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          /* Real Results Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <ListingCard
                key={item._id || item.id}
                id={item._id || item.id}
                _id={item._id}
                image={item.image}
                badge={item.badge}
                title={item.title}
                price={item.price}
                location={item.location}
                rating={item.rating}
                category={item.category}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Searchresult;