import { Box, TextField, Typography, Slider } from '@mui/material';

const NoteSettings = ({ wordCount, setWordCount, complexity, setComplexity }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Word Count"
        type="number"
        value={wordCount}
        onChange={(e) => setWordCount(Math.min(1000, Math.max(50, parseInt(e.target.value) || 50)))}
        inputProps={{ min: 50, max: 1000 }}
        helperText="Choose a word count between 50 and 1000"
      />
      <Box>
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
        <Typography variant="caption" color="text.secondary">
          Adjust the complexity of the generated note (1% simplest, 100% most complex)
        </Typography>
      </Box>
    </Box>
  );
};

export default NoteSettings;