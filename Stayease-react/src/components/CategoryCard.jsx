import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ title, icon, categoryValue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const target = categoryValue || title;
    navigate(`/search?category=${encodeURIComponent(target)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative text-white text-center font-bold p-6 rounded-3xl shadow-xl bg-linear-to-br from-[#00CEC9] to-[#6C5CE7] hover:scale-105 active:scale-95 border border-white/20 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-300" />
      <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition duration-300">
        {icon}
      </span>
      <span className="text-base tracking-wide drop-shadow-sm">{title}</span>
    </div>
  );
};

export default CategoryCard;