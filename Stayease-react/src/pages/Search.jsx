import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Searchfilters from "../components/Searchfilters";
import Searchresult from "../components/Searchresult";
import AIChatbot from "../components/AIChatbot";
import { listingsAPI, aiAPI } from "../services/api";
import staticListing from "../data/listing";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [budget, setBudget] = useState(searchParams.get("budget") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [roomType, setRoomType] = useState("All");
  const [sort, setSort] = useState("newest");

  const [isSmartMode, setIsSmartMode] = useState(!!searchParams.get("smartPrompt"));
  const [smartPrompt, setSmartPrompt] = useState(searchParams.get("smartPrompt") || "");
  const [detectedCriteria, setDetectedCriteria] = useState(null);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings based on current filters
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setDetectedCriteria(null);

    try {
      if (isSmartMode && smartPrompt.trim()) {
        const data = await aiAPI.smartSearch(smartPrompt.trim());
        setListings(data.listings || []);
        setDetectedCriteria(data.detectedCriteria || null);
      } else {
        const queryParams = {
          category: category !== "All" ? category : undefined,
          location: location.trim() || undefined,
          budget: budget !== "All" ? budget : undefined,
          roomType: roomType !== "All" ? roomType : undefined,
          sort,
        };

        const data = await listingsAPI.getAll(queryParams);
        if (data.listings && data.listings.length > 0) {
          setListings(data.listings);
        } else {
          // If no matching DB listings found, check static fallback for smooth UX
          const filtered = staticListing.filter((item) => {
            const catMatch = category === "All" || item.category === category;
            const locMatch =
              !location ||
              item.location.toLowerCase().includes(location.toLowerCase());
            return catMatch && locMatch;
          });
          setListings(filtered);
        }
      }
    } catch (err) {
      console.warn("Fetch error, using fallback:", err.message);
      setListings(staticListing);
    } finally {
      setLoading(false);
    }
  }, [category, budget, location, roomType, sort, isSmartMode, smartPrompt]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleResetFilters = () => {
    setCategory("All");
    setBudget("All");
    setLocation("");
    setRoomType("All");
    setSort("newest");
    setIsSmartMode(false);
    setSmartPrompt("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <Searchfilters
          category={category}
          setCategory={setCategory}
          budget={budget}
          setBudget={setBudget}
          location={location}
          setLocation={setLocation}
          roomType={roomType}
          setRoomType={setRoomType}
          sort={sort}
          setSort={setSort}
          isSmartMode={isSmartMode}
          setIsSmartMode={setIsSmartMode}
          smartPrompt={smartPrompt}
          setSmartPrompt={setSmartPrompt}
          onSmartSearch={fetchListings}
          onResetFilters={handleResetFilters}
        />

        <Searchresult
          listings={listings}
          loading={loading}
          detectedCriteria={detectedCriteria}
          onReset={handleResetFilters}
        />
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Search;
