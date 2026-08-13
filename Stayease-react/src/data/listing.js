import images1 from "../assets/images/images1.jpg";
import images2 from "../assets/images/images2.jpg";
import images3 from "../assets/images/images3.jpg";
import images4 from "../assets/images/images4.jpg";
import images5 from "../assets/images/images5.jpg";
import images6 from "../assets/images/images6.jpg";
import images7 from "../assets/images/images7.jpg";
import images8 from "../assets/images/images8.jpg";
import images9 from "../assets/images/images9.jpg";
import images10 from "../assets/images/images10.jpg";

const listing = [
  {
    id: 1,
    image: images1,
    badge: "Popular",
    title: "Student PG near BHU",
    price: "₹4500 / month",
    category: "Student PG / Hostel",
    location: "BHU, Varanasi",
    mapLocation: "BHU, Varanasi",
    roomType: "Single Room",
    guests: 1,
    bathrooms: 1,
    amenities: ["WiFi", "AC", "Parking", "Security", "Kitchen"],
    description:
      "Comfortable and affordable student PG near BHU with easy access to coaching centres, markets and public transport.",
    rating: 4.5,
    host: {
      name: "Rahul Sharma",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Ananya",
        rating: 5,
        comment: "Amazing location and very comfortable stay.",
      },
      {
        name: "Riya",
        rating: 4,
        comment: "Clean room, good facilities and friendly host.",
      },
    ],
  },

  {
    id: 2,
    image: images2,
    badge: "Featured",
    title: "Cozy Tourist Stay",
    price: "₹1200 / night",
    category: "Tourist Stay",
    location: "Jaipur, Rajasthan",
    mapLocation: "Jaipur, Rajasthan",
    roomType: "Deluxe Room",
    guests: 2,
    bathrooms: 1,
    amenities: ["WiFi", "AC", "TV", "Breakfast", "Parking"],
    description:
      "A cozy stay for travellers located close to popular tourist attractions, restaurants and local markets.",
    rating: 4.7,
    host: {
      name: "Priya Verma",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Arjun",
        rating: 5,
        comment: "Perfect place for exploring Jaipur. The location is excellent.",
      },
      {
        name: "Sneha",
        rating: 4,
        comment: "The room was clean and the overall experience was good.",
      },
    ],
  },

  {
    id: 3,
    image: images3,
    badge: "New",
    title: "Monthly Room in Prime Area",
    price: "₹8000 / month",
    category: "Monthly Rooms",
    location: "South Delhi",
    mapLocation: "South Delhi",
    roomType: "Private Room",
    guests: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "AC",
      "Kitchen",
      "Washing Machine",
      "Security",
    ],
    description:
      "Spacious private room in a prime residential area with easy access to metro stations, shopping centres and daily essentials.",
    rating: 4.3,
    host: {
      name: "Aman Gupta",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Karan",
        rating: 5,
        comment: "Really peaceful place with all the basic amenities.",
      },
      {
        name: "Mehak",
        rating: 4,
        comment: "Good value for money and the host was very helpful.",
      },
    ],
  },

  {
    id: 4,
    image: images4,
    badge: "Verified",
    title: "Secure Parking Space",
    price: "₹40 / hour",
    category: "Parking Space",
    location: "Hazratganj, Lucknow",
    mapLocation: "Hazratganj, Lucknow",
    roomType: "Covered Parking",
    guests: 1,
    bathrooms: 0,
    amenities: ["CCTV", "Security", "Covered Space", "24/7 Access"],
    description:
      "Secure covered parking space in a well-connected area, suitable for short-term parking and daily commuters.",
    rating: 4.6,
    host: {
      name: "Vikas Singh",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Aditya",
        rating: 5,
        comment: "Great parking space and very secure. Everything was as described.",
      },
      {
        name: "Pooja",
        rating: 5,
        comment: "Very convenient location and I felt my vehicle was safe.",
      },
    ],
  },

  {
    id: 5,
    image: images5,
    badge: "Popular",
    title: "Coaching Hub PG",
    price: "₹5500 / month",
    category: "Coaching Stay",
    location: "Rajeev Nagar, Kota",
    mapLocation: "Rajeev Nagar, Kota",
    roomType: "Shared Room",
    guests: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "Study Table",
      "AC",
      "Laundry",
      "Security",
    ],
    description:
      "Student-friendly PG located near major coaching institutes with dedicated study space and a peaceful environment.",
    rating: 4.4,
    host: {
      name: "Neha Mehta",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Rahul",
        rating: 4,
        comment: "Comfortable room and good connectivity to coaching centres.",
      },
      {
        name: "Ishita",
        rating: 5,
        comment: "Very nice experience. The stay felt safe and comfortable.",
      },
    ],
  },

  {
    id: 6,
    image: images6,
    badge: "Budget",
    title: "Budget Tourist Room",
    price: "₹700 / night",
    category: "Tourist Stay",
    location: "Civil Lines, Prayagraj",
    mapLocation: "Civil Lines, Prayagraj",
    roomType: "Standard Room",
    guests: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "Fan",
      "TV",
      "Room Service",
    ],
    description:
      "Affordable and clean room for travellers looking for a comfortable short stay near major city attractions.",
    rating: 4.2,
    host: {
      name: "Rohit Mishra",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Yash",
        rating: 4,
        comment: "Affordable and convenient stay. Good facilities for the price.",
      },
      {
        name: "Nidhi",
        rating: 5,
        comment: "The place was neat, comfortable and exactly like the pictures.",
      },
    ],
  },

  {
    id: 7,
    image: images7,
    badge: "Premium",
    title: "Premium Student Flat",
    price: "₹9000 / month",
    category: "Student PG / Hostel",
    location: "Gomti Nagar, Lucknow",
    mapLocation: "Gomti Nagar, Lucknow",
    roomType: "Private Room",
    guests: 1,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "AC",
      "Kitchen",
      "Parking",
      "Security",
      "Study Table",
    ],
    description:
      "Premium private accommodation for students with modern facilities, dedicated study space and excellent connectivity.",
    rating: 4.8,
    host: {
      name: "Ankit Kapoor",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Varun",
        rating: 4,
        comment: "Nice location with easy access to transport and nearby shops.",
      },
      {
        name: "Simran",
        rating: 5,
        comment: "Wonderful stay and very responsive host. Highly recommended.",
      },
    ],
  },

  {
    id: 8,
    image: images8,
    badge: "Quick Stay",
    title: "Comfortable Short Stay Room",
    price: "₹400 / 4 hours",
    category: "Short Stay",
    location: "Railway Road, Bareilly",
    mapLocation: "Railway Road, Bareilly",
    roomType: "Private Room",
    guests: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "AC",
      "TV",
      "Security",
    ],
    description:
      "Convenient short-stay room for travellers needing a few hours of rest near the railway station and city centre.",
    rating: 4.1,
    host: {
      name: "Sakshi Arora",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Ayush",
        rating: 5,
        comment: "Excellent experience. The room and amenities were great.",
      },
      {
        name: "Kritika",
        rating: 4,
        comment: "Good place for a short stay. Clean and well maintained.",
      },
    ],
  },

  {
    id: 9,
    image: images9,
    badge: "Affordable",
    title: "Affordable Monthly Stay",
    price: "₹6500 / month",
    category: "Monthly Rooms",
    location: "Indira Nagar, Kanpur",
    mapLocation: "Indira Nagar, Kanpur",
    roomType: "Single Room",
    guests: 1,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "Kitchen",
      "Parking",
      "Security",
    ],
    description:
      "Affordable monthly accommodation in a peaceful neighbourhood with easy access to public transport and local markets.",
    rating: 4.4,
    host: {
      name: "Mohit Verma",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Mohit",
        rating: 5,
        comment: "One of the best stays I have booked. Great location and service.",
      },
      {
        name: "Tanya",
        rating: 4,
        comment: "The stay was comfortable and the host was really helpful.",
      },
    ],
  },

  {
    id: 10,
    image: images10,
    badge: "Verified",
    title: "Coaching Student Residence",
    price: "₹6000 / month",
    category: "Coaching Stay",
    location: "Talwandi, Kota",
    mapLocation: "Talwandi, Kota",
    roomType: "Double Sharing",
    guests: 2,
    bathrooms: 1,
    amenities: [
      "WiFi",
      "Study Table",
      "AC",
      "Laundry",
      "CCTV",
      "Mess",
    ],
    description:
      "Well-connected student residence near coaching centres with study-friendly rooms, mess facility and security.",
    rating: 4.6,
    host: {
      name: "Pankaj Yadav",
      verified: true,
    },
    available: true,
    reviews: [
      {
        name: "Dev",
        rating: 5,
        comment: "Great experience overall. Everything was convenient and hassle-free.",
      },
      {
        name: "Sakshi",
        rating: 4,
        comment: "Nice and affordable place with good facilities. Would visit again.",
      },
    ],
  },
];

export default listing;