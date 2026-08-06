import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-linear-to-br from-[#f5f7ff] to-[#e6fffb] flex items-center justify-center py-20 px-6">
        <LoginForm />
      </main>

      <Footer />
    </>
  );
};

export default Login;