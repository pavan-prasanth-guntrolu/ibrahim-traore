import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { AuthProvider } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

// Core components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import CurtainLanding from "./pages/CurtainLanding";

// Pages with lazy loading for better performance
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Register = lazy(() => import("@/pages/Register"));
const Schedule = lazy(() => import("@/pages/Schedule"));
const Workshops = lazy(() => import("@/pages/Workshops"));
const Speakers = lazy(() => import("@/pages/Speakers"));
const Hackathon = lazy(() => import("@/pages/Hackathon"));
const Materials = lazy(() => import("@/pages/Materials"));
const Sponsors = lazy(() => import("@/pages/Sponsors"));
const Organizers = lazy(() => import("@/pages/Organizers"));
const CodeOfConduct = lazy(() => import("@/pages/CodeOfConduct"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Refer = lazy(() => import("@/pages/Refer"));
const Team = lazy(() => import("@/pages/Team"));
const Supporters = lazy(() => import("@/pages/Supporters"));
const Secret = lazy(() => import("@/pages/Secret"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [showScroll, setShowScroll] = useState(false);
  const { scrollYProgress } = useScroll();

  const checkScrollTop = () => {
    if (window.scrollY > 200) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (
        user &&
        (user.email === "pavanprasanth48850@gmail.com" ||
          user.email === "nikkikatnikkil44@gmail.com" ||
          user.email === "s210214@rguktsklm.ac.in" ||
          user.email === "johnrajuch6@gmail.com" ||
          user.email === "kasimvalinspl@gmail.com" ||
          user.email === "nikkikatnikkil44@gmail.com" ||
          user.email === "prabhasvemula7@gmail.com" ||
          user.email === "neesh235@gmail.com" ||
          user.email === "anushasanapathi549@gmail.com" ||
          user.email === "veerarohit789@gmail.com" ||
          user.email === "s220083@rguktsklm.ac.in" ||
          user.email === "s220505@rguktsklm.ac.in" ||
          user.email === "s220556@rguktsklm.ac.in" ||
          user.email === "s210664@rguktsklm.ac.in" ||
          user.email === "praveen14641@gmail.com" ||
          user.email === "johnbabuchaduvula0@gmail.com")
      ) {
        setIsAdmin(true);
      }
    };

    checkAdmin();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="qiskit-fest-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/opening" element={<CurtainLanding />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/workshops" element={<Workshops />} />
                        <Route path="/speakers" element={<Speakers />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/hackathon" element={<Hackathon />} />
                        <Route path="/materials" element={<Materials />} />
                        {isAdmin && (
                          <Route path="/secret" element={<Secret />} />
                        )}
                        <Route path="/sponsors" element={<Sponsors />} />
                        <Route path="/organizers" element={<Organizers />} />
                        <Route path="/supporters" element={<Supporters />} />
                        <Route
                          path="/code-of-conduct"
                          element={<CodeOfConduct />}
                        />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                          path="/event/:eventId"
                          element={<EventDetail />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/refer" element={<Refer />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AnimatePresence>
                </main>
                <Footer />
                {showScroll && (
                  <div className="fixed bottom-4 right-4 w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-current text-gray-200 dark:text-gray-700"
                        strokeWidth="3"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-current text-primary"
                        strokeWidth="3"
                        fill="transparent"
                        strokeLinecap="round"
                        style={{ pathLength: scrollYProgress }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <button
                      onClick={scrollToTop}
                      className="absolute inset-0 m-auto w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 19.5V4.5m7.5 7.5L12 4.5 4.5 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
