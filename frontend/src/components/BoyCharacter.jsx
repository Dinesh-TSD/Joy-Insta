// File: /components/BoyCharacter.jsx
import { motion } from 'framer-motion';
import boyImg from '../assets/boy.png';
import heartIcon from '../assets/heart.png';

const BoyCharacter = ({ isProposing, proposalResult }) => {
  return (
    <div className="flex flex-col items-center">
      <motion.img
        src={boyImg}
        alt="Boy"
        className="w-100 h-100"
        animate={isProposing ? { y: [-10, 0, -10] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      {isProposing && (
        <motion.img
          src={heartIcon}
          alt="Heart"
          className="w-12 h-12 mt-2 absolute"
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{ x: 250, y: -120, opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      )}

      {proposalResult === 'rejected' && (
        <p className="text-red-400 mt-2">💔 Rejected</p>
      )}
      {proposalResult === 'accepted' && (
        <p className="text-green-400 mt-2">💖 Accepted</p>
      )}
    </div>
  );
};

export default BoyCharacter;