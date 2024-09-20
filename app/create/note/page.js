'use client';
import { useState } from 'react';
import { Box, Button, Typography, Container, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Note from '../../../components/Note';
import TopicOrFileInput from '../../../components/TopicOrFileInput';
import NoteSettings from '../../../components/NoteSettings';
import NotePreview from '../../../components/NotePreview';

const steps = ['Choose Input', 'Configure Settings', 'Generate Note', 'Review and Save'];

const CreateNote = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(200);
  const [complexity, setComplexity] = useState(50);
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
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
      setActiveStep(0);
      setTopic('');
      setFile(null);
      setNote(null);
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
      if (file) {
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
      setActiveStep(3);
    } catch (err) {
      console.error('Error generating note:', err);
      setError(`Failed to generate note: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <TopicOrFileInput onTopicChange={handleTopicChange} onFileUpload={handleFileUpload} />;
      case 1:
        return <NoteSettings wordCount={wordCount} setWordCount={setWordCount} complexity={complexity} setComplexity={setComplexity} />;
      case 2:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Typography variant="h6">
              {isLoading ? 'Generating your note...' : 'Click "Generate" to create your note'}
            </Typography>
          </Box>
        );
      case 3:
        return note ? <NotePreview note={note} /> : null;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Your Custom Note
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button onClick={saveNote} variant="contained" color="primary" disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Note'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === 2 ? handleGenerateNote : handleNext}
                  disabled={isLoading || (activeStep === 0 && !topic && !file)}
                >
                  {activeStep === 2 ? (isLoading ? 'Generating...' : 'Generate') : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default CreateNote;