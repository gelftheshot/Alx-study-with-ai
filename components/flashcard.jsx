import { Box, Typography } from "@mui/material";
import { useState } from "react";

const flashcardStyle = {
  width: "350px",
  height: "220px",
  perspective: "1000px",
  cursor: "pointer",
};

const cardInnerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
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
  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
};

const cardFrontStyle = {
  ...cardFaceStyle,
  backgroundColor: "white",
};

const cardBackStyle = {
  ...cardFaceStyle,
  backgroundColor: "#4caf50", // Green background for the answer side
  transform: "rotateY(180deg)",
};

const Flashcard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Box sx={flashcardStyle} onClick={handleClick}>
      <Box sx={{
        ...cardInnerStyle,
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
      }}>
        <Box sx={cardFrontStyle}>
          <Typography variant="h5">Question</Typography>
        </Box>
        <Box sx={cardBackStyle}>
          <Typography variant="h5" color="white">Answer</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Flashcard;