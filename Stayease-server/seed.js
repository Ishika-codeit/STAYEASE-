require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Listing = require("./models/Listing");
const Booking = require("./models/Booking");
const Notification = require("./models/Notification");

const seedData = async () => {
  try {
    await connectDB();
    console.log("🌱 Clearing existing data...");

    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});

    console.log("👤 Creating demo users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const hostPassword = await bcrypt.hash("host123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);
    const guestPassword = await bcrypt.hash("guest123", 10);

    const admin = await User.create({
      fullName: "StayEase Admin",
      email: "admin@stayease.com",
      phone: "9876543210",
      password: adminPassword,
      role: "admin",
      city: "New Delhi",
      bio: "StayEase+ System Administrator & Platform Manager.",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    });

    const host1 = await User.create({
      fullName: "Rahul Sharma",
      email: "host@stayease.com",
      phone: "9123456780",
      password: hostPassword,
      role: "host",
      city: "Varanasi",
      bio: "Superhost with 4+ years of hospitality experience near BHU.",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    });

    const host2 = await User.create({
      fullName: "Priya Verma",
      email: "priya@stayease.com",
      phone: "9123456781",
      password: hostPassword,
      role: "host",
      city: "Jaipur",
      bio: "Welcoming guests to the Pink City with authentic Rajasthani heritage stays.",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    });

    const guest1 = await User.create({
      fullName: "Ananya Saxena",
      email: "guest@stayease.com",
      phone: "9876501234",
      password: guestPassword,
      role: "guest",
      city: "Lucknow",
      bio: "Engineering student & avid explorer looking for comfortable stays.",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    });

    console.log("🏠 Creating realistic property listings...");

    const listingsData = [
      {
        title: "Student PG near BHU",
        badge: "Popular",
        price: "₹4500 / month",
        priceNumber: 4500,
        pricePeriod: "month",
        category: "Student PG / Hostel",
        location: "BHU, Varanasi",
        mapLocation: "BHU, Varanasi, Uttar Pradesh",
        coordinates: { lat: 25.2677, lng: 82.9913 },
        roomType: "Single Room",
        guests: 1,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Parking", "Security", "Kitchen", "Study Table"],
        description:
          "Comfortable and affordable student PG right next to BHU campus with easy access to libraries, coaching centres, markets, and public transport. High speed optical WiFi included.",
        rating: 4.8,
        host: host1._id,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
        images: [
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
        ],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Ananya",
            rating: 5,
            comment: "Amazing location right next to BHU gate. Study environment is peaceful.",
          },
          {
            name: "Riya",
            rating: 4,
            comment: "Clean room, fast WiFi, and Rahul bhaiya is very helpful.",
          },
        ],
      },
      {
        title: "Cozy Heritage Tourist Stay",
        badge: "Featured",
        price: "₹1200 / night",
        priceNumber: 1200,
        pricePeriod: "night",
        category: "Tourist Stay",
        location: "C-Scheme, Jaipur",
        mapLocation: "C-Scheme, Jaipur, Rajasthan",
        coordinates: { lat: 26.9124, lng: 75.7873 },
        roomType: "Deluxe Room",
        guests: 2,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "TV", "Breakfast", "Parking"],
        description:
          "A cozy stay for travellers located close to Hawa Mahal, City Palace, local handicraft markets, and premier cafes. Authentic Rajasthani hospitality and morning chai included.",
        rating: 4.9,
        host: host2._id,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        ],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Arjun",
            rating: 5,
            comment: "Perfect place for exploring Jaipur. The rooftop view is stunning.",
          },
        ],
      },
      {
        title: "Monthly Studio Room in Prime Area",
        badge: "Verified",
        price: "₹8000 / month",
        priceNumber: 8000,
        pricePeriod: "month",
        category: "Monthly Rooms",
        location: "Hauz Khas, South Delhi",
        mapLocation: "Hauz Khas, South Delhi, Delhi",
        coordinates: { lat: 28.5494, lng: 77.2001 },
        roomType: "Private Room",
        guests: 2,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Kitchen", "Washing Machine", "Security"],
        description:
          "Spacious private room in prime residential Hauz Khas with easy access to metro stations, parks, shopping centres, and daily essentials. Fully furnished with modular kitchen.",
        rating: 4.6,
        host: host1._id,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        ],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Karan",
            rating: 5,
            comment: "Great apartment, 5 mins walk to yellow line metro.",
          },
        ],
      },
      {
        title: "24/7 Covered Secure Parking Space",
        badge: "Verified",
        price: "₹40 / hour",
        priceNumber: 40,
        pricePeriod: "hour",
        category: "Parking Space",
        location: "Hazratganj, Lucknow",
        mapLocation: "Hazratganj, Lucknow, Uttar Pradesh",
        coordinates: { lat: 26.8504, lng: 80.9499 },
        roomType: "Covered Parking",
        guests: 1,
        bathrooms: 0,
        amenities: ["CCTV", "Security", "24/7 Access", "Covered Space"],
        description:
          "Secure covered parking slot in central Hazratganj with 24/7 gated security, high-definition CCTV surveillance, EV charging point, and easy entry/exit ramps.",
        rating: 4.7,
        host: host2._id,
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
        images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Aditya",
            rating: 5,
            comment: "Safest parking in Hazratganj. No hassle parking.",
          },
        ],
      },
      {
        title: "Premier Coaching Hub PG",
        badge: "Popular",
        price: "₹5500 / month",
        priceNumber: 5500,
        pricePeriod: "month",
        category: "Coaching Stay",
        location: "Rajeev Nagar, Kota",
        mapLocation: "Rajeev Nagar, Kota, Rajasthan",
        coordinates: { lat: 25.1388, lng: 75.8348 },
        roomType: "Shared Room",
        guests: 2,
        bathrooms: 1,
        amenities: ["WiFi", "Study Table", "AC", "Laundry", "Mess", "CCTV", "Security"],
        description:
          "Tailor-made for NEET and JEE aspirants! Located 200m from Allen and Resonance institutes. Complete with ergonomic study desks, nutritious hygienic mess, and peaceful study atmosphere.",
        rating: 4.8,
        host: host1._id,
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
        images: [
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        ],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Rahul",
            rating: 5,
            comment: "Best PG for studying. Very quiet and mess food is tasty.",
          },
        ],
      },
      {
        title: "Comfortable Transit Short Stay",
        badge: "Quick Stay",
        price: "₹400 / 4 hours",
        priceNumber: 400,
        pricePeriod: "4 hours",
        category: "Short Stay",
        location: "Civil Lines, Bareilly",
        mapLocation: "Civil Lines, Bareilly, Uttar Pradesh",
        coordinates: { lat: 28.3670, lng: 79.4304 },
        roomType: "Private Room",
        guests: 2,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "TV", "Security"],
        description:
          "Ideal short stay room for passengers with train layovers or travellers needing a quick rest and refresh. Just 5 minutes from Bareilly Junction railway station.",
        rating: 4.4,
        host: host2._id,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"],
        available: true,
        status: "approved",
        reviews: [
          {
            name: "Ayush",
            rating: 4,
            comment: "Very convenient for layovers between trains.",
          },
        ],
      },
    ];

    const createdListings = await Listing.insertMany(listingsData);
    console.log(`✅ Inserted ${createdListings.length} listings.`);

    console.log("📅 Creating demo bookings...");
    const sampleBooking = await Booking.create({
      listing: createdListings[0]._id,
      host: host1._id,
      guest: guest1._id,
      listingTitle: createdListings[0].title,
      listingImage: createdListings[0].image,
      location: createdListings[0].location,
      price: createdListings[0].price,
      totalAmount: 4500,
      name: guest1.fullName,
      email: guest1.email,
      phone: guest1.phone,
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      guests: 1,
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentId: "pay_demo_test_verified_99",
    });

    console.log("🔔 Creating demo notifications...");
    await Notification.create({
      recipient: guest1._id,
      sender: host1._id,
      title: "Booking Confirmed 🎉",
      message: `Your booking for "${createdListings[0].title}" has been confirmed!`,
      type: "booking",
      link: "/mybookings",
    });

    await Notification.create({
      recipient: host1._id,
      sender: guest1._id,
      title: "Payment Received 💳",
      message: `Received ₹4500 from ${guest1.fullName} for "${createdListings[0].title}".`,
      type: "booking",
      link: "/mylistings",
    });

    console.log("\n==============================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==============================================");
    console.log("DEMO ACCOUNTS READY TO USE:");
    console.log("👑 ADMIN: email: admin@stayease.com | password: admin123");
    console.log("🏠 HOST:  email: host@stayease.com  | password: host123");
    console.log("👤 GUEST: email: guest@stayease.com | password: guest123");
    console.log("==============================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
