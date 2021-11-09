import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

interface CompProp {
  load: () => void;
  save: () => void;
  compile: () => void;
}

export default function TopBar(props: CompProp) {
  const { load, save, compile } = props;
  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <Button variant="contained" onClick={load}>
          <FolderOpenSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={save}>
          <SaveSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
          <SettingsSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
          <PermMediaSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={compile}>
          <FileDownloadSharpIcon />
        </Button>
      </Grid>
    </Grid>
  );
}
