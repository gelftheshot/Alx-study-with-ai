'use client'
import { Box, Typography, Popover } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';

const flashcardStyle = {
  width: "100%",
  height: "220px",
  perspective: "1500px",
  cursor: "pointer",
  position: "relative",
  fontFamily: "'Roboto Slab', serif",
  margin: "8px",
};

const cardStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
};

const cardFaceStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};

const Flashcard = ({ question, answer, isFlipped, setIsFlipped }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    if (setIsFlipped) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleInfoClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const flipVariants = {
    front: {
      rotateX: 0,
      backgroundColor: "#f0f4f8", // Soft blue-gray for the question side
      transition: { duration: 0.6, ease: [0.645, 0.045, 0.355, 1.000] }
    },
    back: {
      rotateX: 180,
      backgroundColor: "#2196f3", // Blue for the answer side
      transition: { duration: 0.6, ease: [0.645, 0.045, 0.355, 1.000] }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }
  };

  return (
    <Box sx={flashcardStyle}>
      <motion.div
        style={cardStyle}
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={flipVariants}
        whileHover="hover"
        onClick={handleClick}
      >
        <motion.div
          style={{
            ...cardFaceStyle,
            backgroundColor: "#f0f4f8", // Soft blue-gray for the question side
          }}
        >
          <motion.div 
            variants={contentVariants} 
            initial="hidden" 
            animate={isFlipped ? "hidden" : "visible"}
            style={{ padding: '16px', textAlign: 'center' }}
          >
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: "#333" }}>{question}</Typography>
          </motion.div>
        </motion.div>
        <motion.div
          style={{
            ...cardFaceStyle,
            backgroundColor: "#2196f3",
            transform: "rotateX(180deg)",
          }}
        >
          <motion.div 
            variants={contentVariants} 
            initial="hidden" 
            animate={isFlipped ? "visible" : "hidden"}
            style={{ padding: '16px', textAlign: 'center' }}
          >
            <Typography variant="body1" color="white" sx={{ fontFamily: "'Montserrat', sans-serif" }}>{answer}</Typography>
          </motion.div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 10,
              cursor: "pointer",
            }}
            onClick={handleInfoClick}
            whileHover={{
              scale: 1.2,
              color: "#ffd700",
              textShadow: "0 0 8px #ffd700",
            }}
          >
            <InfoIcon fontSize="small" />
          </motion.div>
        )}
      </AnimatePresence>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleInfoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            backgroundColor: "#f0f8ff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "10px",
          }
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography sx={{ fontFamily: "'Lora', serif" }}>Detailed explanation of the answer goes here. This is a placeholder text until you implement the backend.</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default Flashcard;