import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </div>
  );
}
