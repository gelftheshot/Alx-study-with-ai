import { Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const NotePreview = ({ note }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Generated Note Preview
      </Typography>
      <Paper elevation={2} sx={{ p: 3, maxHeight: '400px', overflow: 'auto' }}>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </Paper>
    </Box>
  );
};

export default NotePreview;