import React from "react";
import CategoryCard from "./CategoryCard";

const Category = () => {
  const categories = [
    { title: "Student PG / Hostel", icon: "🎓", value: "Student PG / Hostel" },
    { title: "Tourist Stay", icon: "🏖️", value: "Tourist Stay" },
    { title: "Coaching Stay", icon: "📚", value: "Coaching Stay" },
    { title: "Short Stay", icon: "⏱️", value: "Short Stay" },
    { title: "Parking Space", icon: "🚗", value: "Parking Space" },
    { title: "Monthly Rooms", icon: "🏢", value: "Monthly Rooms" },
  ];

  return (
    <section className="w-full py-16 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-transparent bg-clip-text tracking-wide drop-shadow-[0_0_12px_rgba(108,92,231,0.4)]">
          Explore by Accommodation Type
        </h2>
        <p className="text-gray-500 text-base md:text-lg mt-3">
          Find spaces tailored to students, tourists, daily commuters, and professionals.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={idx}
            title={cat.title}
            icon={cat.icon}
            categoryValue={cat.value}
          />
        ))}
      </div>
    </section>
  );
};

export default Category;