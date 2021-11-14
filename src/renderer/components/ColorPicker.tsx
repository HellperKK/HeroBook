import { useState } from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/system/Box';

export default function ViewWindow() {
  const [color] = useState('#FFF');

  return (
    <Button variant="contained">
      <Box
        sx={{
          backgroundColor: color,
          width: '16px',
          height: '16px',
          border: '1px solid black',
        }}
      />
    </Button>
  );
}
