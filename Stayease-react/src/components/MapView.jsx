import React, { useState } from "react";
import { MapPin, Navigation, Compass, School, Train, Building, CheckCircle2 } from "lucide-react";

const MapView = ({
  location = "Varanasi, Uttar Pradesh",
  mapLocation = "BHU, Varanasi",
  coordinates = { lat: 25.2677, lng: 82.9913 },
  title = "Accommodation Location",
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const lat = coordinates?.lat || 25.2677;
  const lng = coordinates?.lng || 82.9913;

  // Nearby landmarks dynamically tailored to location
  const isVaranasi = (location || "").toLowerCase().includes("varanasi") || (location || "").toLowerCase().includes("bhu");
  const isKota = (location || "").toLowerCase().includes("kota");
  const isDelhi = (location || "").toLowerCase().includes("delhi");
  const isJaipur = (location || "").toLowerCase().includes("jaipur");

  const nearbyPlaces = [
    {
      name: isVaranasi
        ? "Banaras Hindu University (BHU Main Gate)"
        : isKota
        ? "Allen Career Institute (Sankalp Campus)"
        : isDelhi
        ? "Delhi University / IIT Delhi Campus"
        : "Rajasthan University & Central Library",
      type: "education",
      distance: "0.4 km",
      time: "5 min walk",
      icon: <School className="w-4 h-4 text-purple-600" />,
    },
    {
      name: isVaranasi
        ? "Varanasi Junction (Cantt Railway Station)"
        : isKota
        ? "Kota Junction Railway Station"
        : isDelhi
        ? "Hauz Khas Yellow Line Metro Station"
        : "Jaipur Junction Railway Station",
      type: "transit",
      distance: "2.1 km",
      time: "8 min drive",
      icon: <Train className="w-4 h-4 text-[#00CEC9]" />,
    },
    {
      name: isVaranasi
        ? "Lanka Market & Local Shopping Plaza"
        : isKota
        ? "City Mall & Rajeev Nagar Food Street"
        : isDelhi
        ? "Hauz Khas Market & Cafes"
        : "Bapu Bazar & Handicraft Souk",
      type: "lifestyle",
      distance: "0.3 km",
      time: "3 min walk",
      icon: <Building className="w-4 h-4 text-emerald-500" />,
    },
  ];

  // OpenStreetMap embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.015}%2C${lng + 0.015}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;
  const gmapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-bold">Location & Connectivity</h3>
          </div>
          <p className="text-gray-500 text-sm mt-1">📍 {mapLocation || location}</p>
        </div>

        <a
          href={gmapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
      </div>

      {/* Embedded OpenStreetMap */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <iframe
          title={`Map of ${title}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={osmUrl}
          className="w-full h-full filter saturate-110"
        />

        {/* Floating Pin Card */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 text-xs font-semibold text-gray-800">
          <MapPin className="w-4 h-4 text-[#6C5CE7]" />
          <span>Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
        </div>
      </div>

      {/* Nearby Landmark Distances */}
      <div className="mt-6">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
          Nearby Landmarks & Coaching Centers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nearbyPlaces.map((place, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3 hover:bg-gray-100/80 transition"
            >
              <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">{place.icon}</div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{place.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="font-bold text-[#6C5CE7]">{place.distance}</span>
                  <span>•</span>
                  <span>{place.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
