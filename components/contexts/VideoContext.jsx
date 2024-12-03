import React, { createContext, useState, useEffect } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoSrc, setVideoSrc] = useState(() => {
    const savedDeviceVideo = localStorage.getItem('lastDeviceVideoSrc');
    const savedYouTubeVideo = localStorage.getItem('lastYouTubeVideoSrc');
    return savedDeviceVideo || savedYouTubeVideo || 'https://youtu.be/RgcOQo-Ty_I';
  });
  const [videoFile, setVideoFile] = useState(() => {
    const savedVideoFileName = localStorage.getItem('lastVideoFileName');
    return savedVideoFileName ? { name: savedVideoFileName } : null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem('lastVolume')) || 1
  );
  const [uploadCooldown, setUploadCooldown] = useState(0);
  const [lastUploadTime, setLastUploadTime] = useState(
    parseInt(localStorage.getItem('lastUploadTime')) || 0
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoType, setVideoType] = useState('default');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let timer;
    if (uploadCooldown > 0) {
      timer = setInterval(() => {
        setUploadCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [uploadCooldown]);

  const startUploadCooldown = () => {
    setLastUploadTime(Date.now());
    setUploadCooldown(10);
  };

  const resetToDefaultVideo = () => {
    setVideoSrc('https://youtu.be/RgcOQo-Ty_I');
    setVideoFile(null);
    setIsPlaying(false);
    setVideoType('default');
    setVideoError(false);
    localStorage.removeItem('lastDeviceVideoSrc');
    localStorage.removeItem('lastVideoFileName');
  };

  const saveVideoFile = (file, type) => {
    setVideoFile(file);
    const fileUrl = URL.createObjectURL(file);
    setVideoSrc(fileUrl);
    setVideoType(type);
    localStorage.setItem('lastVideoFileName', file.name);
    
    if (videoError) {
      resetToDefaultVideo();
    }
  };

  return (
    <VideoContext.Provider value={{
      videoSrc, 
      setVideoSrc, 
      videoFile,
      saveVideoFile,
      isPlaying, 
      setIsPlaying, 
      volume, 
      setVolume,
      uploadCooldown,
      startUploadCooldown,
      resetToDefaultVideo,
      lastUploadTime,
      isFullScreen,
      setIsFullScreen,
      videoType,
      setVideoType,
      videoError,
      setVideoError
    }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;