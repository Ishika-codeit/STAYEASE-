import ListingCard from "./ListingCard";
import listing from "../data/listing";
const featuredListings = listing.filter(
  (item) => [1, 2, 5, 7, 10].includes(item.id)
);

const Featured = () => {
  return (
    <section className="w-full py-10 px-6">
      <h2
        className="text-4xl md:text-6xl font-semibold text-center mt-17
        bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
        text-transparent bg-clip-text
        drop-shadow-[0_0_10px_rgba(108,92,231,0.4)]"
      >
        Featured Listings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {featuredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            image={listing.image}
            badge={listing.badge}
            title={listing.title}
            price={listing.price}
          />
        ))}
      </div>
    </section>
  );
};

export default Featured;