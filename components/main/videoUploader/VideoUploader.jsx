import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { VideoContext } from '../../contexts/VideoContext';

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const FileInputWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const StyledFileLabel = styled.label`
  display: inline-block;
  width: 200px;
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(187, 134, 252, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LinkUploadContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 800px;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(187, 134, 252, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const CooldownMessage = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-top: 10px;
`;

const VideoUploader = () => {
  const { 
    setVideoSrc, 
    saveVideoFile,
    uploadCooldown, 
    startUploadCooldown 
  } = useContext(VideoContext);
  const [videoLink, setVideoLink] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateVideoUrl = (url) => {
    const platformRegexes = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)/,
      /(?:https?:\/\/)?(?:(?:www|vm)\.)?tiktok\.com\/@[^\/]+\/video\/\d+/
    ];

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

    return (
      platformRegexes.some(regex => regex.test(url)) || 
      videoExtensions.some(ext => url.toLowerCase().includes(ext))
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setError('');

    if (!file) {
      setError('Файл не вибрано');
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Будь ласка, виберіть відео-файл');
      fileInputRef.current.value = '';
      return;
    }

    if (uploadCooldown > 0) {
      setError(`Зачекайте ${uploadCooldown} секунд перед наступним завантаженням`);
      return;
    }

    try {
      const fileUrl = URL.createObjectURL(file);
      setVideoSrc(fileUrl);
      saveVideoFile(file, 'device');
      startUploadCooldown();
    } catch (err) {
      setError('Помилка при завантаженні файлу');
    }
  };

  const handleLinkUpload = () => {
    setError('');

    if (!videoLink.trim()) {
      setError('Введіть посилання на відео');
      return;
    }

    if (uploadCooldown > 0) {
      setError(`Зачекайте ${uploadCooldown} секунд перед наступним завантаженням`);
      return;
    }

    if (!validateVideoUrl(videoLink)) {
      setError('Некоректне посилання на відео');
      return;
    }

    setVideoSrc(videoLink);
    startUploadCooldown();
    setVideoLink('');
  };

  return (
    <UploaderContainer>
      <FileInputWrapper>
        <HiddenFileInput 
          ref={fileInputRef}
          type="file" 
          accept="video/*" 
          onChange={handleFileUpload} 
          disabled={uploadCooldown > 0}
          id="fileInput"
        />
        <StyledFileLabel 
          htmlFor="fileInput"
          disabled={uploadCooldown > 0}
        >
          Вибрати файл
        </StyledFileLabel>
      </FileInputWrapper>

      <LinkUploadContainer>
        <StyledInput 
          type="text" 
          value={videoLink} 
          onChange={(e) => setVideoLink(e.target.value)} 
          placeholder="Введіть посилання на відео"
          disabled={uploadCooldown > 0}
        />
        <StyledButton 
          onClick={handleLinkUpload}
          disabled={uploadCooldown > 0}
        >
          Завантажити
        </StyledButton>
      </LinkUploadContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {uploadCooldown > 0 && (
        <CooldownMessage>
          Зачекайте {uploadCooldown} сек. перед наступним завантаженням
        </CooldownMessage>
      )}
    </UploaderContainer>
  );
};

export default VideoUploader;