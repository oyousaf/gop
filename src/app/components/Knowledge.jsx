import { motion } from "framer-motion";

export default function Knowledge() {
  return (
    <section
      id="knowledge"
      role="region"
      aria-label="Knowledge Banner"
      className="w-full h-72 mb-[100px] flex justify-center items-center bg-gradient-to-r from-background to-teal-700 relative overflow-hidden shadow-lg"
    >
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/60 to-black/30 z-0"></div>

      {/* Screen-reader heading */}
      <h2 className="sr-only">Knowledge Section</h2>

      {/* Animated Text */}
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
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="block mt-4"
        >
          طلب العلم من المهد إلى اللحد
        </motion.span>
      </motion.div>
    </section>
  );
}
