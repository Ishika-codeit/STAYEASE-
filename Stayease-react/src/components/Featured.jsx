import React, { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { listingsAPI } from "../services/api";
import staticListing from "../data/listing";
import { Sparkles } from "lucide-react";

const Featured = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await listingsAPI.getAll({ sort: "rating" });
        if (data.listings && data.listings.length > 0) {
          setFeaturedListings(data.listings.slice(0, 8));
        } else {
          setFeaturedListings(staticListing.slice(0, 6));
        }
      } catch (err) {
        console.warn("Using fallback listings:", err.message);
        setFeaturedListings(staticListing.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="w-full py-16 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Handpicked & Verified</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(108,92,231,0.4)]">
          Featured Accommodations
        </h2>
        <p className="text-gray-500 text-base md:text-lg mt-3">
          Top-rated stays with verified hosts and modern amenities.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-gray-100 rounded-3xl h-80 animate-pulse border border-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing) => (
            <ListingCard
              key={listing._id || listing.id}
              id={listing._id || listing.id}
              _id={listing._id}
              image={listing.image}
              badge={listing.badge}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              rating={listing.rating}
              category={listing.category}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Featured;