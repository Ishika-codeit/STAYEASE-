import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-linear-to-br from-[#f5f7ff] to-[#e6fffb] flex items-center justify-center py-20 px-6">
        <SignupForm />
      </main>

      <Footer />
    </>
  );
};

export default Signup;