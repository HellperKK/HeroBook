import Button from '@mui/material/Button';
import Box from '@mui/system/Box';

interface CompProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker(props: CompProps) {
  const { value, onChange } = props;

  const pick = () => {
    const colorWell = document.createElement('input');
    colorWell.type = 'color';
    colorWell.value = value;
    colorWell.addEventListener(
      'change',
      (e) => {
        const val = (e.target as HTMLInputElement).value;
        onChange(val);
      },
      false
    );
    colorWell.click();
  };

  return (
    <Button variant="contained" onClick={pick}>
      <Box
        sx={{
          backgroundColor: value,
          width: '16px',
          height: '16px',
          border: '1px solid black',
        }}
      />
    </Button>
  );
}
