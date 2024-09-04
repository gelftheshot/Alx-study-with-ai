'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const TopicOrFileInput = ({ onTopicChange, onFileUpload }) => {
  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    onTopicChange(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileUpload(selectedFile);
  };

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
        <Box>
          <input
            accept=".txt,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span">
              Upload File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TopicOrFileInput;
