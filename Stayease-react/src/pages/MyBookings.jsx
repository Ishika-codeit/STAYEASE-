import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings =
      JSON.parse(localStorage.getItem("myBookings")) || [];

    setBookings(savedBookings);
  }, []);

  const handleCancel = (id) => {

    const updatedBookings = bookings.filter(
      (booking) => booking.id !== id
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      "myBookings",
      JSON.stringify(updatedBookings)
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="mb-10">

            <h1 className="text-4xl font-bold">
              My Bookings
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage your upcoming stays.
            </p>

          </div>


          {bookings.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg
              p-12 text-center">

              <div className="text-6xl mb-5">
                📅
              </div>

              <h2 className="text-2xl font-bold mb-2">
                No Bookings Yet
              </h2>

              <p className="text-gray-500 mb-6">
                Find a comfortable stay and make your first booking.
              </p>

              <Link
                to="/Search"
                className="inline-block px-6 py-3 rounded-xl
                text-white font-semibold
                bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]"
              >
                Explore Stays
              </Link>

            </div>

          ) : (

            <div className="space-y-6">

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="bg-white rounded-3xl shadow-lg
                  overflow-hidden"
                >

                  <div className="flex flex-col md:flex-row">

                    {/* Image */}

                    <img
                      src={booking.listingImage}
                      alt={booking.listingTitle}
                      className="w-full md:w-64 h-56 object-cover"
                    />


                    {/* Details */}

                    <div className="flex-1 p-6">

                      <div className="flex flex-col md:flex-row
                        md:justify-between gap-4">

                        <div>

                          <span className="inline-block
                            bg-green-100 text-green-600
                            px-3 py-1 rounded-full
                            text-sm font-semibold">
                            ✓ {booking.status}
                          </span>

                          <h2 className="text-2xl font-bold mt-3">
                            {booking.listingTitle}
                          </h2>

                          <p className="text-gray-500 mt-1">
                            📍 {booking.location}
                          </p>

                        </div>

                        <p className="text-[#6C5CE7]
                          font-bold text-xl">
                          {booking.price}
                        </p>

                      </div>


                      {/* Booking Info */}

                      <div className="grid grid-cols-2 md:grid-cols-4
                        gap-4 mt-6">

                        <div>
                          <p className="text-gray-400 text-sm">
                            Guest
                          </p>

                          <p className="font-semibold">
                            {booking.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-sm">
                            Phone
                          </p>

                          <p className="font-semibold">
                            {booking.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-sm">
                            Date
                          </p>

                          <p className="font-semibold">
                            {booking.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-sm">
                            Guests
                          </p>

                          <p className="font-semibold">
                            {booking.guests}
                          </p>
                        </div>

                      </div>


                      {/* Actions */}

                      <div className="flex gap-3 mt-6">

                        <Link
                          to={`/listing/${booking.listingId}`}
                          className="px-5 py-2 rounded-xl
                          border border-[#6C5CE7]
                          text-[#6C5CE7] font-semibold
                          hover:bg-[#6C5CE7]
                          hover:text-white transition"
                        >
                          View Listing
                        </Link>

                        <button
                          onClick={() =>
                            handleCancel(booking.id)
                          }
                          className="px-5 py-2 rounded-xl
                          border border-red-400
                          text-red-500 font-semibold
                          hover:bg-red-500
                          hover:text-white transition"
                        >
                          Cancel Booking
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

      <Footer />
    </>
  );
};

export default MyBookings;