import { motion } from "framer-motion";

export default function Knowledge() {
  return (
    <div className="w-full h-72 mb-[100px] flex justify-center items-center bg-gradient-to-r from-background to-teal-700 relative overflow-hidden shadow-lg">
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/50 to-black/20 z-0"></div>

      {/* Animated Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center font-custom-font text-4xl md:text-6xl text-white leading-tight px-6 md:px-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="block mt-4"
        >
          طلب العلم من المهد إلى اللحدا
        </motion.span>
      </motion.div>
    </div>
  );
}
