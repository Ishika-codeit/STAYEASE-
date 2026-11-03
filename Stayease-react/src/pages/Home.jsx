import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Category from "../components/Category";
import Featured from "../components/Featured";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <main>
        <Hero />
        <SearchBar />
        <Category />
        <Featured />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Home;