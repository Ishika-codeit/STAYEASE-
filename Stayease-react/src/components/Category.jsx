import CategoryCard from "./CategoryCard";

const Category = () => {
  return (
    <section className="w-full py-10 px-6">
      <h2 className="text-4xl md:text-6xl font-bold text-center mt-17 bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-transparent bg-clip-text tracking-wide drop-shadow-[0_0_10px_rgba(108,92,231,0.4)]">
        What Are You Looking For?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-20">
        <CategoryCard title="Tourist Stay" />
        <CategoryCard title="Hostel" />
        <CategoryCard title="Parking Space"/>
        <CategoryCard title="PG"/>
        <CategoryCard title="Apartment" />
        
      </div>
    </section>
  );
};

export default Category;