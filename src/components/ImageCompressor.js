import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageCompressor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [compressedLink, setCompressedLink] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewSrc(URL.createObjectURL(file));
      setOriginalSize((file.size / 1024 / 1024).toFixed(2));
      setCompressedLink("");
      setCompressedSize(0);
      setErrorMsg("");
    }
  };

  const handleQualityChange = (e) => {
    setQuality(parseFloat(e.target.value));
  };

  const handleCompression = async () => {
    if (!imageFile) {
      setErrorMsg("Please select an image first.");
      return;
    }

    setIsCompressing(true);
    setErrorMsg("");

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: quality,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      setCompressedLink(URL.createObjectURL(compressedFile));
      setCompressedSize((compressedFile.size / 1024 / 1024).toFixed(2));
    } catch (error) {
      console.error(error);
      setErrorMsg("Error compressing image. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Image Compressor
      </h1>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {previewSrc && (
        <div className="mb-6">
          <img
            src={previewSrc}
            alt="Preview"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="quality" className="block mb-2 font-medium">
          Compression Quality: {quality}
        </label>
        <input
          type="range"
          id="quality"
          min="0.1"
          max="1"
          step="0.1"
          value={quality}
          onChange={handleQualityChange}
          className="w-full"
        />
      </div>

      <button
        onClick={handleCompression}
        disabled={!imageFile || isCompressing}
        className={`w-full py-2 px-4 rounded font-bold text-white ${
          !imageFile || isCompressing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isCompressing ? "Compressing..." : "Compress Image"}
      </button>

      {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}

      {compressedLink && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="mb-2">
            <strong>Original size:</strong> {originalSize} MB
          </p>
          <p className="mb-4">
            <strong>Compressed size:</strong> {compressedSize} MB
          </p>
          <a
            href={compressedLink}
            download="compressed_image.jpg"
            className="block w-full text-center py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
