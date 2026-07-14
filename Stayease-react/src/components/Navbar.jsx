const Navbar = ()=>{
    return (
        <nav className="w-full h-20 fixed top-0 left-0 z-50 
     text-white flex justify-between items-center
     bg-black/40 backdrop-blur-lg shadow-lg px-6">

   <div className="text-2xl font-bold font-sans tracking-wide flex items-center">

  <span className="ml-2 bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] 
        bg-clip-text text-transparent transition duration-300 
        hover:drop-shadow-[0_0_10px_#00CEC9]">
      StayEase
  </span>

  <span className="text-[#00CEC9] ml-1 transition duration-300 
        hover:drop-shadow-[0_0_10px_#00CEC9]">
      +
  </span>

</div>


   { /* LINKS */}
    <div className="ml-auto flex items-center space-x-12 text-lg font-semibold">

        <a href="home.html" className="relative hover:text-[#00CEC9] transition duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-[#00CEC9]
            after:transition-all after:duration-300 hover:after:w-full">
            Home
        </a>

        <a href="search.html" className="relative hover:text-[#6C5CE7] transition duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-[#6C5CE7]
            after:transition-all after:duration-300 hover:after:w-full">
            Search
        </a>

        <a href="#" className="relative hover:text-[#00CEC9] transition duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-[#00CEC9]
            after:transition-all after:duration-300 hover:after:w-full">
            Host-listing
        </a>

        <a href="#" className="relative hover:text-[#6C5CE7] transition duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-[#6C5CE7]
            after:transition-all after:duration-300 hover:after:w-full">
            Contact
        </a>

        <a href="login.html" className="relative hover:text-[#00CEC9] transition duration-200
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-[#00CEC9]
            after:transition-all after:duration-300 hover:after:w-full">
            Login
        </a>

       { /*SIGNUP BUTTON*/}
        <a href="signup.html" className="bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] 
            text-black font-bold px-4 py-2 rounded-lg shadow-md
            hover:shadow-xl hover:scale-105 active:scale-95 transition">
            SignUp
        </a>

    </div>
</nav>
    )

    
}
export default Navbar;