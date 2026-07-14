import heroVideo from "../assets/hero-video.mp4";

const Hero = () =>{
    return (
            <section className="hero relative h-screen pt-20 flex flex-col items-center justify-center text-center overflow-hidden">

  
          <video autoPlay muted loop class="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src={heroVideo} type="video/mp4"/>
               Your browser does not support the video tag.
         </video>
         <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>

         <div className="relative z-10 px-4">
         <h1 className="text-5xl md:text-6xl font-bold text-white typing-animation border-r-4 border-white pr-1 mb-4 text-shadow-[0_0_12px_rgba(0,230,208,0.75)]
drop-shadow-[0_0_20px_rgba(108,92,231,0.85)]
">
      Smart Stays, Easy Living — All in One Place.
    </h1>
    <p className="text-2xl md:text-3xl font-bold text-white/80 subheading-animation">
      Bringing Comfort Closer to You.
    </p>
  </div>

</section> 

    )
}
export default Hero;