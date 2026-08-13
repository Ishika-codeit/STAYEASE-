import listing from "../data/listing";
import ListingCard from "./ListingCard";
import { Link } from "react-router-dom";

const Searchresult = ({ category, budget, location }) => {

  const filteredListings = listing.filter((item) => {

    const categoryMatch =
      category === "All" ||
      item.category === category;

    const price = parseInt(
      item.price.replace(/[^\d]/g, "")
    );

    const budgetMatch =
      budget === "All" ||
      (budget === "below500" && price < 500) ||
      (budget === "500-1000" && price >= 500 && price <= 1000) ||
      (budget === "1000-3000" && price > 1000 && price <= 3000) ||
      (budget === "above3000" && price > 3000);

    const locationMatch =
      location === "" ||
      item.location.toLowerCase().includes(location.toLowerCase());

    return categoryMatch && budgetMatch && locationMatch;
  });

  return (
    <section className="w-full px-6 py-10">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Available Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredListings.map((item) => (
            <div key={item.id}>

              <Link
                to={`/listing/${item.id}`}
                className="block mb-3 text-[#6C5CE7] font-semibold hover:underline"
              >
                View Details →
              </Link>

              <ListingCard
                image={item.image}
                badge={item.badge}
                title={item.title}
                price={item.price}
              />

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Searchresult;