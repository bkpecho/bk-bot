import Compressor from "compressorjs";
export const getCompressedImage = (file) => {
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      return result;
    },
    error(err) {
      console.log(err.message);
    },
  });
};
