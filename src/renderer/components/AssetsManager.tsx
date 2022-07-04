import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { useState } from 'react';

import { State } from '../../utils/state';
import { identity, openFiles, readImage, noExt } from '../../utils/utils';

const StyledImage = styled.img`
  max-width: 85vw;
  max-height: 85vh;
`;

const assetPath = (assetType: string, assetName: string) =>
  `assets/${assetType}/${assetName}`;

const getExtensions = (assetType: string) => {
  switch (assetType) {
    case 'image':
      return [
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/png',
        'image/webp',
      ];
    default:
      return [];
  }
};

interface CompProps {
  open: boolean;
  close: () => void;
}

export default function AssetsManager(props: CompProps) {
  const { open, close } = props;
  const { game, zip, assets } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

  const [selectedAsset, setSelectedAsset] = useState(-1);
  const { images } = assets;

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);

    arrFiles.forEach(async (fi) => {
      const pathName = assetPath(assetType, fi.name);
      zip.file(pathName, fi);

      const image = await readImage(fi);
      newAssets.set(fi.name, image);
    });

    dispatch({
      type: 'addAssets',
      files: newAssets,
      fileType: 'images',
    });
  };

  const removeAsset = (assetType: string, assetName: string) => () => {
    const pathName = assetPath(assetType, assetName);
    zip.remove(pathName);

    if (assets.images.size === 1 || assets.images.size === selectedAsset + 1) {
      setSelectedAsset(assets.images.size - 2);
    }

    dispatch({
      type: 'removeAsset',
      fileName: assetName,
      fileType: assetType,
    });
  };

  return (
    <Modal open={open}>
      <Box sx={{ height: '100vh', backgroundColor: 'white' }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={3} xl={2}>
            {/* Image List */}
            <List sx={{ overflow: 'auto' }}>
              {Array.from(images.keys()).map((fileName, index) => (
                <ListItem
                  onClick={() => setSelectedAsset(index)}
                  key={`item${index + 42}`}
                  sx={{
                    bgcolor: index === selectedAsset ? 'secondary.main' : '',
                    cursor: 'pointer',
                  }}
                >
                  <ListItemText
                    primary={noExt(fileName)}
                    sx={{
                      color: index === selectedAsset ? 'white' : '',
                    }}
                  />
                  <Button
                    variant="contained"
                    disabled={game.pages.length === 1}
                    onClick={removeAsset('images', fileName)}
                  >
                    <DeleteSharpIcon />
                  </Button>
                </ListItem>
              ))}
              <ListItem>
                <Button
                  variant="contained"
                  sx={{ width: '100%' }}
                  onClick={addAsset('images')}
                >
                  <AddSharpIcon />
                </Button>
              </ListItem>
            </List>
          </Grid>

          {/* Image Display */}
          <Grid item xs={9} xl={10}>
            <Box>
              <StyledImage
                src={Array.from(assets.images.values())[selectedAsset]}
              />
            </Box>
          </Grid>
        </Grid>
        <Container>
          <Button variant="contained" onClick={close} sx={{ width: '100%' }}>
            <CloseSharpIcon />
          </Button>
        </Container>
      </Box>
    </Modal>
  );
}
