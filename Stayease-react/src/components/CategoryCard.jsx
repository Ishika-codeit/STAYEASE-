const CategoryCard = ({ title }) => {
  return (
    <div className="text-white text-center font-semibold py-6 rounded-2xl shadow-lg bg-linear-to-br from-[#00E6D0] to-[#6C5CE7] hover:scale-105 hover:bg-linear-to-br hover:text-[#6C5CE7] hover:from-white hover:to-white border border-white/20 cursor-pointer transition duration-300">
      {title}
    </div>
  );
};

export default CategoryCard;