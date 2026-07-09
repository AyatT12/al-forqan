import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Mascot from "../components/Mascot";

export default function Root() {
  const location = useLocation();
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
      <Mascot />
    </div>
  );
}
