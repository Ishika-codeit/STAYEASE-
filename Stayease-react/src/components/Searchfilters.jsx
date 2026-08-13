const Searchfilters = ({
  category,
  setCategory,
  budget,
  setBudget,
    location,
    setLocation
}) => {
  return (
    <section className="w-full px-6 pt-28 pb-10">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-bold text-center
          bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
          bg-clip-text text-transparent mb-3"
        >
          Find Your Perfect Stay
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Search stays, PGs, rooms and parking spaces around you.
        </p>

        {/* Search Box */}
        <div
          className="bg-white rounded-2xl shadow-xl
          border border-[#7F7CFF]/30 p-5
          grid grid-cols-1 md:grid-cols-4 gap-4"
        >

          {/* Location */}
          <input
            type="text"
            placeholder="City, landmark or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-2 border-[#7F7CFF] rounded-xl p-3
            focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-[#7F7CFF] rounded-xl p-3
            focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          >
            <option value="All">All Categories</option>

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

          {/* Budget */}
          <select
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  className="border-2 border-[#7F7CFF] rounded-xl p-3
  focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
>
  <option value="All">All Budgets</option>
  <option value="below500">Below ₹500</option>
  <option value="500-1000">₹500 - ₹1000</option>
  <option value="1000-3000">₹1000 - ₹3000</option>
  <option value="above3000">Above ₹3000</option>
</select>

          {/* Search Button */}
          <button
            type="button"
            className="rounded-xl font-bold text-black
            bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
            hover:scale-105 active:scale-95 transition"
          >
            Search Now
          </button>

        </div>

      </div>

    </section>
  );
};

export default Searchfilters;