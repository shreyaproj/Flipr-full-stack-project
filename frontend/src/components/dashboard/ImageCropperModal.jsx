import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropperModal = ({ imageSrc, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSave = async () => {
    const croppedBlob = await getCroppedImg();
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        <div className="relative flex-1 bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={450 / 350} // Required Aspect Ratio
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label className="text-sm font-medium text-gray-700">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="space-x-3">
            <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">Cancel</button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crop & Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;