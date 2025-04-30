'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AnimatedWaves() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[28px] overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ zIndex: 3 }}
      >
        <Image
          src="/wave.svg"
          alt="Wave"
          width={1600}
          height={28}
          className="w-[200%] h-[28px]"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full"
        animate={{
          x: ['-50%', '0%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ zIndex: 2, opacity: 0.7 }}
      >
        <Image
          src="/wave.svg"
          alt="Wave"
          width={1600}
          height={28}
          className="w-[200%] h-[28px]"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ zIndex: 1, opacity: 0.4 }}
      >
        <Image
          src="/wave.svg"
          alt="Wave"
          width={1600}
          height={28}
          className="w-[200%] h-[28px]"
          priority
        />
      </motion.div>
    </div>
  );
} 