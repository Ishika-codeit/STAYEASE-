const Footer = () => {
    return (
        <footer className="w-full py-8 px-6 bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] bg-opacity-95 backdrop-blur-lg text-white font-sans">
  
  <div className="text-center mb-10">
    <h3 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2 text-white drop-shadow-lg">
      Smart Stays, Easy Living — All in One Place.
    </h3>
    <p className="text-md md:text-lg font-semibold text-gray-100 max-w-2xl mx-auto drop-shadow-sm">
      StayEase+ helps you find affordable rooms, student PGs, tourist stays, short-term stays, and parking spots in major cities across India.
    </p>
  </div>

  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left mb-10">
    
    
    <div>
      <h4 className="text-xl font-bold mb-3 text-white drop-shadow-md">Quick Links</h4>
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Login
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Search
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Host Listings
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Sign-Up
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">
            Contact
          </a>
        </li>
      </ul>
    </div>

    
    <div>
      <h4 className="text-xl font-bold mb-3 text-white drop-shadow-md">Contact Us</h4>
      <p className="text-gray-100 font-semibold">Email: <a href="mailto:ishikasaxena@gmail.com" className="hover:text-white hover:scale-105 transition-all duration-300">ishikasaxena@gmail.com</a></p>
      <p className="text-gray-100 font-semibold">Phone: <a href="tel:9258855840" className="hover:text-white hover:scale-105 transition-all duration-300">9258855840</a></p>
      <p className="text-gray-100 font-semibold">Address: Bareilly, UP</p>
      <p className="text-gray-200 italic mt-1 drop-shadow-sm">We usually respond within 24 hours.</p>
    </div>

    <div>
      <h4 className="text-xl font-bold mb-3 text-white drop-shadow-md">Follow Us</h4>
      <div className="flex flex-col space-y-2">
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-110 hover:underline hover:drop-shadow-md">Facebook</a>
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-110 hover:underline hover:drop-shadow-md">LinkedIn</a>
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-110 hover:underline hover:drop-shadow-md">Instagram</a>
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-110 hover:underline hover:drop-shadow-md">Twitter</a>
      </div>
    </div>

  
    <div>
      <h4 className="text-xl font-bold mb-3 text-white drop-shadow-md">Legal</h4>
      <p className="text-gray-200 mb-2 font-semibold drop-shadow-sm">&copy; 2024 StayEase+. All rights reserved</p>
      <div className="flex flex-col space-y-1">
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">Privacy Policy</a>
        <a href="#" className="text-gray-200 font-semibold transition-all duration-300 transform hover:text-white hover:scale-105 hover:underline hover:drop-shadow-md">Terms Of Service</a>
      </div>
    </div>
    
  </div>

  
  <div className="text-center text-gray-200 text-sm font-semibold drop-shadow-sm">
    Made with 💜 and 💧 by StayEase+
  </div>
</footer>
    )

}
export default Footer;