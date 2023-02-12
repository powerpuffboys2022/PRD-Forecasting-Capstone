import React from "react";
import ChatContent from "../ChatContent";
import { motion, AnimatePresence } from "framer-motion";
const UserChat = ({ visible, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration : 0.2 , ease : "easeInOut"}}
          exit={{ opacity: 0 }}
          className="absolute z-40 smooth-shadow-fade right-0 py-5 px-0 h-screen w-full md:w-1/3 bg-white"
        >
          <ChatContent onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserChat;
