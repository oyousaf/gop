import { motion } from "framer-motion";

export default function Banner() {
  return (
    <section
      id="welcome"
      role="region"
      aria-label="Welcome Banner"
      className="w-full h-72 mt-[100px] flex justify-center items-center bg-gradient-to-r from-background to-teal-700 relative overflow-hidden shadow-lg"
    >
      {/* Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/60 to-black/30 z-0"></div>

      {/* Optional screen-reader-only heading */}
      <h2 className="sr-only">Welcome Section</h2>

      {/* Animated Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative z-10 text-center font-custom-font text-4xl md:text-6xl text-white leading-tight px-6 md:px-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="block"
        >
          مرحبا
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="block mt-4"
        >
          أهلا و سهلا
        </motion.span>
      </motion.div>
    </section>
  );
}
