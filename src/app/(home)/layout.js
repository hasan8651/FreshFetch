import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function HomeLayout({ children }) {
  return (
    <>
      <Toaster />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}