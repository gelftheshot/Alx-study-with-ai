'use client'
import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

const Note = ({ title, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1">
          {content}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default Note;