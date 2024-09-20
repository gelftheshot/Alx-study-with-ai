'use client'
import { Box, Typography, Popover } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import InfoIcon from '@mui/icons-material/Info';

const flashcardStyle = {
  width: "100%",
  height: "250px",
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
  borderRadius: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const Flashcard = ({ question, answer, detail, strength }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
    hover: { scale: 1.05 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Box style={flashcardStyle}>
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
            backgroundColor: "#f0f4f8",
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
            transform: "rotateY(180deg)",
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
            }}
          >
            <InfoIcon
              onClick={handleInfoClick}
              sx={{ color: "white", cursor: "pointer" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
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
          <Typography sx={{ fontFamily: "'Lora', serif" }}>
            {detail || "No detail available for this question"}
          </Typography>
        </Box>
      </Popover>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: `rgba(33, 150, 243, ${parseInt(strength) / 100})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.8rem',
        }}
      >
        {strength}
      </Box>
    </Box>
  );
};

export default Flashcard;