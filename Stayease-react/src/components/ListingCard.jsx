import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";

const ListingCard = ({
  id,
  _id,
  image,
  badge = "Popular",
  title,
  price,
  location = "",
  rating = 4.5,
  category = "",
}) => {
  const navigate = useNavigate();
  const listingId = id || _id;

  const defaultImg =
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800";

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between">
      {/* Thumbnail + Badge */}
      <div className="relative overflow-hidden h-52 bg-gray-100">
        <img
          src={image || defaultImg}
          alt={title}
          onError={(e) => {
            e.target.src = defaultImg;
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="bg-[#6C5CE7] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
            {badge}
          </span>

          <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        {category && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
            {category}
          </span>
        )}
      </div>

      {/* Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6C5CE7] transition line-clamp-1 mb-1">
            {title}
          </h3>

          {location && (
            <p className="text-gray-500 text-xs flex items-center gap-1 line-clamp-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#00CEC9] shrink-0" />
              <span>{location}</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 mb-4">
            <span className="text-xs text-gray-400 font-medium">Rent</span>
            <span className="text-lg font-extrabold text-[#6C5CE7]">{price}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/listing/${listingId}`}
              className="py-2.5 px-3 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] font-bold text-xs text-center hover:bg-[#6C5CE7] hover:text-white transition flex items-center justify-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              to={`/booking/${listingId}`}
              className="py-2.5 px-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-xs text-center shadow-md hover:scale-102 active:scale-98 transition flex items-center justify-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;