import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import GameStore from "@/components/GameStore";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import FloatingCTA from "@/components/FloatingCTA";
import CartDrawer from "@/cart/CartDrawer";

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillService, setPrefillService] = useState("");

  const openBooking = (service = "") => {
    setPrefillService(service);
    setBookingOpen(true);
  };

  return (
    <main
      data-testid="home-page"
      className="relative min-h-screen bg-[#060608] text-white overflow-x-hidden"
    >
      {/* Ambient radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(0,229,255,0.12), transparent 60%), radial-gradient(900px 500px at 100% 10%, rgba(184,41,255,0.12), transparent 60%), radial-gradient(800px 400px at 50% 110%, rgba(0,255,102,0.06), transparent 60%)",
        }}
      />

      <Navbar onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />
      <Marquee />
      <Services onBook={openBooking} />
      <GameStore />
      <About />
      <Testimonials />
      <Contact />
      <Footer />

      <FloatingCTA onClick={() => openBooking()} />

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        defaultService={prefillService}
      />

      <CartDrawer />
    </main>
  );
}
