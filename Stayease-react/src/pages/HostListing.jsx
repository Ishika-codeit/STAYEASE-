import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HostListing = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tourist Stay");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [roomType, setRoomType] = useState("Private Room");
  const [guests, setGuests] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [available, setAvailable] = useState(true);

  const [amenities, setAmenities] = useState([]);
 const [listingCreated, setListingCreated] = useState(false);
  const availableAmenities = [
    "WiFi",
    "AC",
    "Parking",
    "Security",
    "Kitchen",
    "TV",
    "Breakfast",
    "Laundry",
    "Study Table",
    "CCTV",
    "Mess",
    "Washing Machine",
  ];

  const handleAmenityChange = (amenity) => {

    if (amenities.includes(amenity)) {

      setAmenities(
        amenities.filter((item) => item !== amenity)
      );

    } else {

      setAmenities([
        ...amenities,
        amenity
      ]);

    }
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const newListing = {
    id: Date.now(),
    title,
    category,
    location,
    price,
    roomType,
    guests,
    bathrooms,
    amenities,
    description,
    image: imagePreview,
    available,
    rating: 0,
    badge: "New",
    host: {
      name: "Current Host",
      verified: false,
    },
    reviews: [],
  };

  const existingListings =
    JSON.parse(localStorage.getItem("myListings")) || [];

  localStorage.setItem(
    "myListings",
    JSON.stringify([
      ...existingListings,
      newListing,
    ])
  );

  setListingCreated(true);
};
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">

            <h1
              className="text-4xl md:text-5xl font-bold
              bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
              bg-clip-text text-transparent"
            >
              List Your Property
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Share your space with people looking for a
              comfortable stay.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-10"
          >

            {/* PROPERTY INFORMATION */}
            <section>

              <h2 className="text-2xl font-bold mb-6">
                Property Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Title */}
                <div className="md:col-span-2">

                  <label className="block font-semibold mb-2">
                    Property Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Cozy PG near BHU"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  />

                </div>


                {/* Category */}
                <div>

                  <label className="block font-semibold mb-2">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  >

                    <option value="Tourist Stay">
                      Tourist Stay
                    </option>

                    <option value="Student PG / Hostel">
                      Student PG / Hostel
                    </option>

                    <option value="Coaching Stay">
                      Coaching Stay
                    </option>

                    <option value="Short Stay">
                      Short Stay
                    </option>

                    <option value="Parking Space">
                      Parking Space
                    </option>

                    <option value="Monthly Rooms">
                      Monthly Rooms
                    </option>

                  </select>

                </div>


                {/* Location */}
                <div>

                  <label className="block font-semibold mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="City, area or landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  />

                </div>

              </div>

            </section>


            {/* PRICE */}
            <section>

              <h2 className="text-2xl font-bold mb-6">
                Pricing
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block font-semibold mb-2">
                    Price
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. ₹4500 / month"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  />

                </div>

              </div>

            </section>


            {/* PROPERTY DETAILS */}
            <section>

              <h2 className="text-2xl font-bold mb-6">
                Property Details
              </h2>

              <div className="grid md:grid-cols-3 gap-5">

                {/* Room */}
                <div>

                  <label className="block font-semibold mb-2">
                    Room Type
                  </label>

                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  >

                    <option>Single Room</option>
                    <option>Double Sharing</option>
                    <option>Shared Room</option>
                    <option>Private Room</option>
                    <option>Deluxe Room</option>
                    <option>Covered Parking</option>

                  </select>

                </div>


                {/* Guests */}
                <div>

                  <label className="block font-semibold mb-2">
                    Guests
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  />

                </div>


                {/* Bathrooms */}
                <div>

                  <label className="block font-semibold mb-2">
                    Bathrooms
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full border rounded-xl p-3
                    focus:outline-none focus:ring-2
                    focus:ring-[#6C5CE7]"
                  />

                </div>

              </div>

            </section>


            {/* AMENITIES */}
            <section>

              <h2 className="text-2xl font-bold mb-2">
                Amenities
              </h2>

              <p className="text-gray-500 mb-5">
                Select the facilities available at your property.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {availableAmenities.map((amenity) => (

                  <label
                    key={amenity}
                    className={`flex items-center gap-2
                    border rounded-xl p-3 cursor-pointer
                    transition
                    ${
                      amenities.includes(amenity)
                        ? "bg-[#6C5CE7]/10 border-[#6C5CE7]"
                        : "hover:bg-gray-50"
                    }`}
                  >

                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="accent-[#6C5CE7]"
                    />

                    <span className="font-medium">
                      {amenity}
                    </span>

                  </label>

                ))}

              </div>

            </section>


            {/* DESCRIPTION */}
            <section>

              <h2 className="text-2xl font-bold mb-6">
                Description
              </h2>

              <textarea
                rows="5"
                placeholder="Tell guests about your property..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border rounded-xl p-3
                focus:outline-none focus:ring-2
                focus:ring-[#6C5CE7]"
              />

            </section>


            {/* IMAGE */}
            <section>

              <h2 className="text-2xl font-bold mb-6">
                Property Image
              </h2>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-xl p-3"
              />

              {imagePreview && (
                <div className="mt-5">

                  <img
                    src={imagePreview}
                    alt="Property Preview"
                    className="w-full max-h-80 object-cover rounded-2xl"
                  />

                </div>
              )}

            </section>


            {/* AVAILABILITY */}
            <section>

              <h2 className="text-2xl font-bold mb-5">
                Availability
              </h2>

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 accent-[#6C5CE7]"
                />

                <span className="font-semibold">
                  This property is currently available
                </span>

              </label>

            </section>


            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl
              text-white font-bold text-lg
              bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
              hover:scale-[1.02]
              active:scale-95
              transition"
            >
              Create Listing
            </button>

          </form>
          {listingCreated && (
  <div className="mt-6 p-5 rounded-2xl bg-green-50 border border-green-200">

    <h2 className="text-xl font-bold text-green-600">
      🎉 Listing Created Successfully!
    </h2>

    <p className="text-gray-600 mt-2">
      Your property has been submitted successfully.
    </p>

  </div>
)}

        </div>

      </main>

      <Footer />
    </>
  );
};

export default HostListing;