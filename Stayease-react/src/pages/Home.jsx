 import React from 'react';
import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import SearchBar from '../components/SearchBar';
 const Home = () => {
    return (
        <div>
            <h1>Welcome to Stayease</h1>
            <Navbar/>
            <Hero/>
            <SearchBar/>
        </div>
    )
}
export default Home;