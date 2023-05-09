import { IMAGE_TYPE } from '../pages/BidHNTF/BidHNFT';
import imageCompression from 'browser-image-compression';

export const compressImageFile = async (file: any, imageType: IMAGE_TYPE) => {
  if (file.type === 'image/gif') {
    return file;
  }
  const options =
    imageType === IMAGE_TYPE.ICON
      ? {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 60,
          useWebWorker: true,
        }
      : {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (e) {
    console.log('image compression failed', e);
    return file;
  }
};
