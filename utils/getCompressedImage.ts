import Compressor from "compressorjs";
export const getCompressedImage = (file) => {
  // TODO: implement image compression
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
