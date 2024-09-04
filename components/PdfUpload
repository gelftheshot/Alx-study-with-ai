'use client';
import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PdfUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      onUpload(selectedFile);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="pdf-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="pdf-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          fullWidth
        >
          Upload PDF
        </Button>
      </label>
      {file && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {file.name}
        </Typography>
      )}
    </Box>
  );
};

export default PdfUpload;
