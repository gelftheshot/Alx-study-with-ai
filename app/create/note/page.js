'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper, Slider, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Note from '../../../components/Note';
import TopicOrFileInput from '../../../components/TopicOrFileInput';

const CreateNote = () => {
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(200);
  const [complexity, setComplexity] = useState(50);
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inputType, setInputType] = useState('topic');
  const { user } = useUser();

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    setFile(null);
  };

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setTopic(uploadedFile.name);
  };

  const saveNote = async () => {
    if (!user || !note) return;

    setSaveLoading(true);
    try {
      const notesRef = collection(db, 'users', user.id, 'notes');
      await addDoc(notesRef, {
        topic,
        content: note.content,
        createdAt: new Date()
      });
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGenerateNote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (inputType === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('wordCount', wordCount.toString());
        formData.append('complexity', complexity.toString());

        const uploadResponse = await fetch('/api/processPdf', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to process PDF');
        }

        const { text } = await uploadResponse.json();

        response = await fetch('/api/generatefrompdf/note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, wordCount, complexity }),
        });
      } else {
        response = await fetch('/api/generate/note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: topic, wordCount, complexity }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate note');
      }

      const data = await response.json();
      setNote(data.note);
    } catch (err) {
      console.error('Error generating note:', err);
      setError(`Failed to generate note: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Note
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
              <RadioGroup
                row
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
              >
                <FormControlLabel value="topic" control={<Radio />} label="Enter Topic" />
                <FormControlLabel value="file" control={<Radio />} label="Upload PDF" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} md={9}>
              <TopicOrFileInput 
                onTopicChange={handleTopicChange} 
                onFileUpload={handleFileUpload}
                inputType={inputType}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  fullWidth
                  label="Word Count"
                  type="number"
                  value={wordCount}
                  onChange={(e) => setWordCount(Math.min(1000, Math.max(50, parseInt(e.target.value) || 50)))}
                  inputProps={{ min: 50, max: 1000 }}
                  margin="normal"
                  required
                />
                <Typography gutterBottom>Complexity: {complexity}%</Typography>
                <Slider
                  value={complexity}
                  onChange={(e, newValue) => setComplexity(newValue)}
                  aria-labelledby="complexity-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={100}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isLoading || (inputType === 'topic' ? !topic : !file)}
                  onClick={handleGenerateNote}
                >
                  {isLoading ? 'Generating...' : 'Generate Note'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {note && (
        <>
          <Note title={topic} content={note.content} />
          <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={saveNote}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Note'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CreateNote;