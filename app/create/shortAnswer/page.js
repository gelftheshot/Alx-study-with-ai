'use client';
import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';

export default function ShortAnswer() {
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to generate short answer questions
    console.log('Generating short answer questions for:', inputType === 'topic' ? topic : file.name);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Short Answer Questions
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Choose input type:</FormLabel>
          <RadioGroup row value={inputType} onChange={(e) => setInputType(e.target.value)}>
            <FormControlLabel value="topic" control={<Radio />} label="Topic" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF File" />
          </RadioGroup>
        </FormControl>
        {inputType === 'topic' ? (
          <TextField
            fullWidth
            label="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <Box {...getRootProps()} sx={{ border: '2px dashed grey', p: 2, mb: 2, cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Typography>{file ? `File selected: ${file.name}` : 'Drag and drop a PDF file here, or click to select'}</Typography>
          </Box>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          Generate Questions
        </Button>
      </Box>
    </Container>
  );
}
