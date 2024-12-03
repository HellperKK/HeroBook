import JSZip from "jszip";
import { Asset, AssetGroup } from "../store/gameSlice";
import { assetPath, readImage } from "./utils";

const loadAssets = async (files: Array<File>) => {
  return files.reduce<Promise<Array<Asset>>>(
    async (
      assetsMemoPromise: Promise<Array<Asset>>,
      fi: File,
      index: number
    ) => {
      const assetsMemo = await assetsMemoPromise;

      //if (/^image/.test(fi.type)) {
        const image = await readImage(fi);
        assetsMemo.push({ name: fi.name, content: image });
      //}

      return assetsMemo;
    },
    Promise.resolve([])
  );
};

const addFilesToZip = (files: Array<File>, zip: JSZip) => {
  files.forEach((file) => {
    if (/^image/.test(file.type)) {
      const pathName = assetPath("images", file.name);
      zip.file(pathName, file);
    }
  });
};

const addAssetsToZip = (assets: AssetGroup, zip: JSZip) => {
  Object.entries(assets).forEach((pair: [string, Array<Asset>]) => {
    const [assetType, assetList]: [string, Array<Asset>] = pair;
    assetList.forEach((asset) => {
      const path = `assets/${assetType}/${asset.name}`;
      const content = asset.content.replace(/data:.*?;base64,/, "");
      zip.file(path, content, { base64: true });
    });
  });
};

export { loadAssets, addFilesToZip, addAssetsToZip };
