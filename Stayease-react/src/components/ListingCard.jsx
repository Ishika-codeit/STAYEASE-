const ListingCard = ({ image, badge, title, price }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#7F7CFF] shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />

        <span className="absolute top-3 left-3 bg-[#6C5CE7] text-white text-sm px-3 py-1 rounded-full">
          {badge}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">
          {title}
        </h3>

        <p className="text-gray-600 text-sm">
          {price}
        </p>

        <button
          className="w-full mt-4 py-2 rounded-xl font-semibold text-white
          bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
          hover:opacity-90 transition"
        >
          Book Now
        </button>
      </div>

    </div>
  );
};

export default ListingCard;