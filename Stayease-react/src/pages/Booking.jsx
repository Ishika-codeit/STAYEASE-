import { useParams } from "react-router-dom";
import listing from "../data/listing";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const Booking = () => {
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [date, setDate] = useState("");
const [guests, setGuests] = useState("");
const handleSubmit = (e) => {
  e.preventDefault();

  const newBooking = {
    id: Date.now(),
    listingId: selectedListing.id,
    listingTitle: selectedListing.title,
    listingImage: selectedListing.image,
    price: selectedListing.price,
    location: selectedListing.location,

    name,
    phone,
    date,
    guests,

    status: "Confirmed",
  };

  const existingBookings =
    JSON.parse(localStorage.getItem("myBookings")) || [];

  localStorage.setItem(
    "myBookings",
    JSON.stringify([
      ...existingBookings,
      newBooking,
    ])
  );

  setBookingConfirmed(true);
};
            

  const { id } = useParams();

  const selectedListing = listing.find(
    (item) => item.id === Number(id)
  );

  if (!selectedListing) {
    return <h1>Listing not found</h1>;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

          <h1 className="text-3xl font-bold mb-2">
            Book Your Stay
          </h1>

          <p className="text-gray-500 mb-8">
            Complete the details below to continue.
          </p>

          {/* Selected Listing */}
          <div className="flex gap-5 items-center border-b pb-6 mb-6">

            <img
              src={selectedListing.image}
              alt={selectedListing.title}
              className="w-28 h-24 object-cover rounded-xl"
            />

            <div>
              <h2 className="text-xl font-bold">
                {selectedListing.title}
              </h2>

              <p className="text-gray-500">
                📍 {selectedListing.location}
              </p>

              <p className="text-[#6C5CE7] font-bold mt-1">
                {selectedListing.price}
              </p>
            </div>

          </div>

          {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

            <input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border rounded-xl p-3"
/>

<input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full border rounded-xl p-3"
/>

<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="w-full border rounded-xl p-3"
/>

<input
  type="number"
  min="1"
  placeholder="Number of Guests"
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
  className="w-full border rounded-xl p-3"
/>


  

  <button
    type="submit"
    className="w-full py-4 rounded-xl text-white font-bold
    bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
    hover:scale-[1.02] transition"
  >
    Confirm Booking
  </button>



          </form>
          {bookingConfirmed && (
  <div className="mt-6 p-5 rounded-2xl bg-green-50 border border-green-200">

    <h2 className="text-xl font-bold text-green-600 mb-2">
      🎉 Booking Confirmed!
    </h2>

    <p className="text-gray-600">
      Your booking request for{" "}
      <span className="font-semibold">
        {selectedListing.title}
      </span>{" "}
      has been received.
    </p>

    <p className="mt-2 text-sm text-gray-500">
      We will contact you shortly for confirmation.
    </p>

  </div>
)}

        </div>

      </main>

      <Footer />
    </>
  );
};

export default Booking;