const SearchBar=()=>{
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 
     mt-30 p-6 
     bg-white/10 backdrop-blur-xl 
     border border-white/20 
     rounded-2xl shadow-xl 
     w-[85%] md:w-[70%] mx-auto">

    
    <div className="w-full md:w-1/2 relative">
        <input 
            type="text" 
            placeholder="Search by city, landmark, address" 
            className="w-full p-4 pl-12 pr-4 rounded-xl 
                   bg-transparent text-black
                   border-2 border-[#7F7CFF]
                   focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] 
                 placeholder:text-black/70 shadow-vm"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00CEC9] text-xl">
            🔍
        </span>
    </div>

   
    <select title="category"
        className="w-full md:w-52 p-4 rounded-xl 
               bg-white/10 text-black text-semibold
                border-[#7F7CFF] border-2
               focus:outline-none focus:ring-2 focus:ring-[#00CEC9]
               placeholder:text-black/70 shadow-vm">
        <option className="text-black" value="">Select Category</option>
        <option className="text-black" value="tourist">Tourist Stay</option>
        <option className="text-black" value="student">Student PG/Flat</option>
        <option className="text-black" value="coaching">Coaching Stay</option>
        <option className="text-black" value="parking">Parking Space</option> 
        <option className="text-black" value="shortstay">Short Stay (2-4 hours)</option>
        <option className="text-black" value="monthly">Monthly Rooms</option>
    </select>

   
    <button 
        className="w-full md:w-40 
               bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9]
               text-black font-bold 
               px-6 py-3 rounded-xl shadow-lg
               hover:scale-105 hover:shadow-xl 
               active:scale-95 transition">
        Search Now
    </button>

</div>



    )
}
export default SearchBar;
