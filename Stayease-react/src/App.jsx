import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import HostListing from "./pages/HostListing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Home from './pages/Home';

const App = () => {
    return (
        <BrowserRouter>
    <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/search" element={<Search />} />

        <Route path="/host-listing" element={<HostListing />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />

    </Routes>
</BrowserRouter>
    )
}

export default App;