import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { handleScroll } from "../utils/scroll";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-white p-2"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-4 text-center max-w-3xl bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md"
        >
          إحياء الأمة بعلم الدين المقدس
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-4 text-lg md:text-2xl text-white/90"
        >
          Reviving the Ummah with sacred knowledge of the Deen
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() => handleScroll("welcome")}
            aria-label="Scroll to Welcome section"
            className="text-white hover:text-white/80 transition duration-300"
          >
            <FaArrowDown size={40} className="animate-bounce" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
