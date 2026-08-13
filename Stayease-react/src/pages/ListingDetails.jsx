
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import listing from "../data/listing";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ListingDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const selectedListing = listing.find(
    (item) => item.id === Number(id)
  );

  if (!selectedListing) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Listing Not Found
            </h1>

            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 rounded-xl text-white font-semibold
              bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]"
            >
              Back to Search
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-[#6C5CE7] font-semibold hover:underline"
          >
            ← Back to Search
          </button>


          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-112.5">

            <div className="md:col-span-3 relative overflow-hidden rounded-3xl">
              <img
                src={selectedListing.image}
                alt={selectedListing.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />

              <span
                className="absolute top-5 left-5
                bg-[#6C5CE7] text-white
                px-4 py-2 rounded-full font-semibold"
              >
                {selectedListing.badge}
              </span>

              {/* Favorite */}
              <button
                onClick={() => setSaved(!saved)}
                className="absolute top-5 right-5
                w-12 h-12 rounded-full bg-white shadow-lg
                text-2xl hover:scale-110 transition"
              >
                {saved ? "❤️" : "♡"}
              </button>
            </div>

            <div className="hidden md:grid grid-rows-2 gap-3">

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={selectedListing.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={selectedListing.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>


          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl mt-6 p-6 md:p-10">

            <div className="flex flex-col md:flex-row
              md:justify-between gap-6">

              <div>

                <p className="text-[#6C5CE7] font-semibold mb-2">
                  {selectedListing.category}
                </p>

                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  {selectedListing.title}
                </h1>

                <p className="text-gray-500 text-lg">
                  📍 {selectedListing.location}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <span className="text-yellow-500 text-xl">
                    ★
                  </span>

                  <span className="font-bold">
                    {selectedListing.rating}
                  </span>

                  <span className="text-gray-500">
                    Excellent rating
                  </span>
                </div>

              </div>

              <div className="md:text-right">

                <p className="text-gray-500">
                  Starting from
                </p>

                <p className="text-3xl font-bold text-[#6C5CE7]">
                  {selectedListing.price}
                </p>

              </div>

            </div>


            {/* Description */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                About this place
              </h2>

              <p className="text-gray-600 leading-relaxed">
                {selectedListing.description}
              </p>

            </div>


            {/* Property Details */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Property Details
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Room Type
                  </p>
                  <p className="font-semibold mt-1">
                    🛏️ {selectedListing.roomType}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Guests
                  </p>
                  <p className="font-semibold mt-1">
                    👤 {selectedListing.guests}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Bathrooms
                  </p>
                  <p className="font-semibold mt-1">
                    🚿 {selectedListing.bathrooms}
                  </p>
                </div>

              </div>

            </div>


            {/* Amenities */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {selectedListing.amenities.map(
                  (amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2
                      bg-gray-50 rounded-xl p-4"
                    >
                      <span className="text-[#00CEC9] font-bold">
                        ✓
                      </span>

                      <span className="font-medium">
                        {amenity}
                      </span>
                    </div>
                  )
                )}

              </div>

            </div>


            {/* Location */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Location
              </h2>

              <div className="bg-linear-to-r
                from-[#6C5CE7]/10 to-[#00CEC9]/10
                rounded-2xl p-6">

                <p className="text-lg font-semibold">
                  📍 {selectedListing.mapLocation}
                </p>

                <p className="text-gray-500 mt-2">
                  Conveniently located with easy access
                  to nearby areas and facilities.
                </p>

                <div className="mt-5 h-40 rounded-xl bg-gray-200
                  flex items-center justify-center text-gray-500">
                  🗺️ Map will be available here
                </div>

              </div>

            </div>


            {/* Host */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Hosted by
              </h2>

              <div className="flex items-center
                bg-gray-50 rounded-2xl p-5">

                <div
                  className="w-14 h-14 rounded-full
                  bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
                  flex items-center justify-center
                  text-white text-xl font-bold"
                >
                  {selectedListing.host.name.charAt(0)}
                </div>

                <div className="ml-4">

                  <p className="font-bold text-lg">
                    {selectedListing.host.name}
                  </p>

                  {selectedListing.host.verified && (
                    <p className="text-green-600 text-sm font-semibold">
                      ✓ Verified Host
                    </p>
                  )}

                </div>

              </div>

            </div>


            {/* Reviews */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Guest Reviews
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {selectedListing.reviews?.map(
                  (review, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-2xl p-5"
                    >

                      <div className="flex justify-between">

                        <p className="font-bold">
                          {review.name}
                        </p>

                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                        </span>

                      </div>

                      <p className="text-gray-600 mt-3">
                        "{review.comment}"
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* Availability */}
            <div className="mt-10">

              {selectedListing.available ? (
                <p className="text-green-600 font-semibold">
                  ✓ Currently Available
                </p>
              ) : (
                <p className="text-red-500 font-semibold">
                  ✕ Currently Unavailable
                </p>
              )}

            </div>


            {/* Book */}
            <button
              disabled={!selectedListing.available}
              onClick={() =>
                navigate(`/booking/${selectedListing.id}`)
              }
              className="w-full mt-8 py-4 rounded-xl
              text-white font-bold text-lg
              bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
              hover:scale-[1.02] active:scale-95 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedListing.available
                ? "Book Now"
                : "Currently Unavailable"}
            </button>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
};

export default ListingDetails;