import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export default function TopBar() {
  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <Button variant="contained">
          <FolderOpenSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
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
        <Button variant="contained">
          <PlayArrowSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
          <FileDownloadSharpIcon />
        </Button>
      </Grid>
    </Grid>
  );
}
