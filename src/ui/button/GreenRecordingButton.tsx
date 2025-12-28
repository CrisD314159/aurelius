import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecordingButtonProps {
  className?: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
  color?: string; // Color principal (ej: #22c55e)
}

const GreenRecordingButton: React.FC<RecordingButtonProps> = ({
                                                                     className = '',
                                                                     isRecording = false,
                                                                     isPlaying = false,
                                                                     onClick,
                                                                     color = '#22c55e',
                                                                   }) => {
  return (
      <div className={`relative flex items-center justify-center ${className}`}>

        {/* Botón Principal */}
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPlaying}
            className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          backdrop-blur-md
          bg-white/50 shadow-lg border-4 transition-colors duration-300
          ${isPlaying ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
        `}
            style={{ borderColor: color }}
        >
          <AnimatePresence mode="wait">
            {isRecording ? (
                // Icono de STOP (Cuadrado)
                <motion.div
                    key="stop"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0, borderRadius: "4px" }}
                    exit={{ scale: 0, rotate: 90 }}
                    className="w-6 h-6"
                    style={{ backgroundColor: color }}
                />
            ) : isPlaying ? (
                // Icono de PLAYING (Tres barritas animadas)
                <motion.div
                    key="playing"
                    className="flex gap-1 items-end h-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                  {[0.5, 0.8, 0.4].map((h, i) => (
                      <motion.div
                          key={i}
                          animate={{ height: ["30%", "100%", "30%"] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                      />
                  ))}
                </motion.div>
            ) : (
                // Icono IDLE (Círculo pequeño)
                <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
  );
};

export default GreenRecordingButton;