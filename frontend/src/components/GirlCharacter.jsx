// File: /components/GirlCharacter.jsx
import { motion } from 'framer-motion';
import girlImg from '../assets/girl.png';

const GirlCharacter = ({ proposalResult }) => {
  return (
    <div className="flex flex-col items-center">
      <motion.img
        src={girlImg}
        alt="Girl"
        className="w-100 h-100"
        animate={
          proposalResult === 'accepted'
            ? { scale: [1, 1.1, 1] }
            : proposalResult === 'rejected'
            ? { rotate: [0, -10, 10, -10, 0] }
            : {}
        }
        transition={{ duration: 0.8 }}
      />
      {proposalResult === 'accepted' && (
        <p className="text-pink-400 mt-2">😊 Yes!</p>
      )}
      {proposalResult === 'rejected' && (
        <p className="text-gray-400 mt-2">🙅‍♀️ No!</p>
      )}
    </div>
  );
};

export default GirlCharacter;
