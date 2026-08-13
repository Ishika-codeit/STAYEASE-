import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyListings = () => {

  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    const savedListings =
      JSON.parse(localStorage.getItem("myListings")) || [];

    setMyListings(savedListings);
  }, []);

  const handleDelete = (id) => {

    const updatedListings = myListings.filter(
      (item) => item.id !== id
    );

    setMyListings(updatedListings);

    localStorage.setItem(
      "myListings",
      JSON.stringify(updatedListings)
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row
            md:items-center md:justify-between gap-4 mb-10">

            <div>
              <h1 className="text-4xl font-bold">
                My Listings
              </h1>

              <p className="text-gray-500 mt-2">
                Manage the properties you have listed on StayEase+.
              </p>
            </div>

            <Link
              to="/hostlisting"
              className="px-5 py-3 rounded-xl text-white
              font-semibold text-center
              bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]"
            >
              + Add New Listing
            </Link>

          </div>


          {myListings.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg
              p-12 text-center">

              <div className="text-6xl mb-5">
                🏠
              </div>

              <h2 className="text-2xl font-bold mb-2">
                No Listings Yet
              </h2>

              <p className="text-gray-500 mb-6">
                Start hosting your space and reach people
                looking for a stay.
              </p>

              <Link
                to="/hostlisting"
                className="inline-block px-6 py-3 rounded-xl
                text-white font-semibold
                bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]"
              >
                Create Your First Listing
              </Link>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2
              lg:grid-cols-3 gap-8">

              {myListings.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg
                  overflow-hidden"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200
                      flex items-center justify-center">
                      🏠
                    </div>
                  )}

                  <div className="p-5">

                    <span className="inline-block
                      bg-[#6C5CE7]/10 text-[#6C5CE7]
                      px-3 py-1 rounded-full text-sm font-semibold">
                      {item.category}
                    </span>

                    <h2 className="text-xl font-bold mt-3">
                      {item.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      📍 {item.location}
                    </p>

                    <p className="text-[#6C5CE7] font-bold mt-3">
                      {item.price}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <Link
                        to={`/listing/${item.id}`}
                        className="flex-1 text-center
                        border border-[#6C5CE7]
                        text-[#6C5CE7]
                        py-2 rounded-xl font-semibold
                        hover:bg-[#6C5CE7]
                        hover:text-white transition"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 border border-red-400
                        text-red-500 py-2 rounded-xl
                        font-semibold hover:bg-red-500
                        hover:text-white transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

      <Footer />
    </>
  );
};

export default MyListings;