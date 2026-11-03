import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/hero-video.mp4";
import ThreeDRoomViewer from "./ThreeDRoomViewer";
import { Sparkles, Eye, X, ArrowRight, Compass } from "lucide-react";

const Hero = () => {
  const [show3DModal, setShow3DModal] = useState(false);

  return (
    <>
      <section className="hero relative h-[90vh] min-h-[600px] pt-20 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] z-10" />

        {/* Hero Content */}
        <div className="relative z-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
          {/* 3D Visual Pill Banner */}
          <button
            onClick={() => setShow3DModal(true)}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#00CEC9]/40 text-white font-semibold text-sm shadow-xl hover:scale-105 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-[#00CEC9] animate-pulse" />
            <span>Experience Interactive 3D Room Tour</span>
            <span className="text-xs bg-[#00CEC9] text-black font-extrabold px-2 py-0.5 rounded-full ml-1">
              3D
            </span>
          </button>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(108,92,231,0.85)]">
            Smart Stays, Easy Living —{" "}
            <span className="bg-linear-to-r from-[#00CEC9] to-[#6C5CE7] bg-clip-text text-transparent">
              All in One Place.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 max-w-2xl drop-shadow-md mb-8">
            Verified student PGs, tourist stays, monthly rentals, and parking spaces across India.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <Compass className="w-5 h-5 text-black" />
              <span>Explore Stays</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <button
              onClick={() => setShow3DModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <Eye className="w-5 h-5 text-[#00CEC9]" />
              <span>Launch 3D Tour</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3D Virtual Tour Modal */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-3xl border border-gray-700 p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#6C5CE7]/20 text-[#00CEC9]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">Interactive 3D PG & Room Tour</h3>
                  <p className="text-xs text-gray-400">
                    Use mouse to rotate 360°, inspect furnishings & toggle night ambience
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShow3DModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ThreeDRoomViewer title="Featured Deluxe Student Room" />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;