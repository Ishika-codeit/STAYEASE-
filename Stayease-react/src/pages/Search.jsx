import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Searchfilters from "../components/Searchfilters";
import ListingCard from "../components/ListingCard";
import Searchresult from "../components/Searchresult";
import { useState } from "react";

 const Search = () => {

  const [category, setCategory] = useState("All");
  const [budget, setBudget] = useState("All");
  const [location, setLocation]= useState("");

  return (
    <>
      <Navbar />

     <Searchfilters
  category={category}
  setCategory={setCategory}
  budget={budget}
  setBudget={setBudget}
  location={location}
  setLocation={setLocation}
/>

      <Searchresult
        category={category}
        budget={budget}
        location={location}
      />

      <Footer />
    </>
  );
};

export default Search;
  

