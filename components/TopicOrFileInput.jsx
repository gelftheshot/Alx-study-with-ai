'use client';
import { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const TopicOrFileInput = ({ onTopicChange, onFileUpload }) => {
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    onTopicChange(e.target.value);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant={inputType === 'topic' ? 'contained' : 'outlined'}
          onClick={() => setInputType('topic')}
          sx={{ mr: 1 }}
        >
          Enter Topic
        </Button>
        <Button
          variant={inputType === 'file' ? 'contained' : 'outlined'}
          onClick={() => setInputType('file')}
        >
          Upload File
        </Button>
      </Box>
      {inputType === 'topic' ? (
        <TextField
          fullWidth
          label="Enter a topic"
          value={topic}
          onChange={handleTopicChange}
          multiline
          rows={4}
        />
      ) : (
        <Paper
          {...getRootProps()}
          elevation={3}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the file here ...</Typography>
          ) : (
            <Typography>Drag and drop a file here, or click to select a file</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default TopicOrFileInput;
