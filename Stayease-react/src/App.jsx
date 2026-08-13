import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import HostListing from "./pages/HostListing";
import MyListings from "./pages/MyListings";
import NotFound from "./pages/NotFound";
import Home from './pages/Home';
import ListingDetails from "./pages/ListingDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings"; 

const App = () => {
    return (
        <BrowserRouter>
    <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/search" element={<Search />} />

        <Route path="/hostlisting" element={<HostListing />} />


        <Route
  path="/listing/:id"
  element={<ListingDetails />}
/>
    <Route path="/booking/:id" element={<Booking />} />
    
        <Route
          path="/mylistings"
          element={<MyListings />}
        />

        <Route
          path="/mybookings"
          element={<MyBookings />}
        />

        <Route path="*" element={<NotFound />} />

    </Routes>
</BrowserRouter>
    )
}

export default App;