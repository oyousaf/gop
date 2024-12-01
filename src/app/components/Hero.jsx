import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { handleScroll } from "../utils/scroll";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <motion.div
        className="relative text-center text-white px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Headings */}
        <motion.h1
          className="md:text-5xl text-4xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          إحياء الأمة بعلم الدين المقدس
        </motion.h1>
        <motion.p
          className="mt-4 md:text-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Reviving the Ummah with sacred knowledge of the Deen
        </motion.p>

        {/* Arrow Button */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button
            onClick={() => handleScroll("makkah")}
            className="text-background hover:text-white rounded-full transition duration-300 ease-in-out"
          >
            <FaArrowDown size={50} className="animate-bounce" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
