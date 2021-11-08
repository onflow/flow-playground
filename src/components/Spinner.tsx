import React from "react";
import { FaCircleNotch } from "react-icons/fa";
import { motion } from "framer-motion";

const Spinner: React.FC = () => {
  return (
    <motion.div 
        style={{
            position: "relative",
            top: "-1.5rem",
            transformOrigin: "center center",
            height: "1rem",
            width: "auto"
        }} 
        animate={{ rotate: 360 }} 
        transition={{ duration: 0.5, loop: Infinity, ease: "linear" }}
    >
        <FaCircleNotch />
    </motion.div>
  );
};

export default Spinner;
