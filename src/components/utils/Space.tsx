import { Box } from '@mui/system';

interface CompProp {
  size: number;
}

export default function Space(props: CompProp) {
  const { size } = props;

  return (
    <Box
      sx={{
        width: `${size * 4}px`,
        display: 'inline-block',
      }}
    />
  );
}
