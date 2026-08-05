 import React from 'react';
import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import SearchBar from '../components/SearchBar';
import Category from '../components/Category';
import Featured from '../components/Featured';
import Footer from '../components/Footer';
 const Home = () => {
    return (
        <div>
            <h1>Welcome to Stayease</h1>
            <Navbar/>
            <Hero/>
            <SearchBar/>
            <Category/>
            <Featured/>
            <Footer/>
        </div>
    )
}
export default Home;