import React, { useRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { VideoContext } from '../../contexts/VideoContext';
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  RefreshCcw
} from 'lucide-react';

const VideoContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlayerWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  background: rgba(30, 30, 46, 0.8);
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadows.neon};
  overflow: hidden;
  position: relative;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: ${props => {
    if (props.fullScreen) return '100vh';
    if (props.type === 'tiktok') return '600px';
    return '600px';
  }};
  max-width: ${props => props.type === 'tiktok' ? '350px' : '1100px'};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.type === 'tiktok' ? '#000' : 'transparent'};
  position: ${props => props.fullScreen ? 'fixed' : 'static'};
  top: 0;
  left: 0;
  z-index: ${props => props.fullScreen ? 1000 : 1};

  video, iframe {
    max-width: 100%;
    max-height: 100%;
    object-fit: ${props => props.type === 'tiktok' ? 'cover' : 'contain'};
  }
`;

const ControlButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-left: 20px;
`;

const CircleButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(187, 134, 252, 0.4);
    background: ${props => props.theme.colors.secondary};
  }

  svg {
    width: 24px;
    height: 24px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  color: ${props => props.theme.colors.error};
  text-align: center;
  padding: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(40, 40, 60, 0.9);
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  
  &:hover {
    background: rgba(187, 134, 252, 0.1);
    box-shadow: ${props => props.theme.shadows.button};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimeSlider = styled.input`
  width: 100%;
  margin: 0 10px;
  appearance: none;
  background: rgba(187, 134, 252, 0.2);
  height: 8px;
  border-radius: 4px;
  
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background: rgba(187, 134, 252, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    height: 15px;
    width: 15px;
    background: ${props => props.theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
    margin-top: -4px;
  }
`;

const VolumeSlider = styled(TimeSlider)`
  width: 100px;
  margin-left: 10px;
`;

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const {
    videoSrc,
    videoFile,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    resetToDefaultVideo,
    isFullScreen,
    setIsFullScreen,
    videoType,
    setVideoType,
    videoError,
    setVideoError
  } = useContext(VideoContext);

  const getVideoType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('tiktok.com')) {
      return 'tiktok';
    }
    return 'device';
  };

  useEffect(() => {
    const type = getVideoType(videoSrc);
    setVideoType(type);
  }, [videoSrc]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.volume = volume;

      try {
        if (isPlaying) {
          videoElement.play().catch(err => {
            console.error('Помилка відтворення:', err);
            setVideoError(true);
            setIsPlaying(false);
          });
        } else {
          videoElement.pause();
        }
      } catch (err) {
        console.error('Помилка взаємодії з відео:', err);
        setVideoError(true);
        setIsPlaying(false);
      }
    }
  }, [videoSrc, isPlaying, volume]);

  const handlePlayPause = () => {
    if (!videoError) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleProgressChange = (e) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const newTime = (e.target.value / 100) * videoElement.duration;
      videoElement.currentTime = newTime;
    }
  };

  const updateProgress = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const handleFullScreen = () => {
    const videoElement = videoRef.current;

    if (!isFullScreen) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleDownload = () => {
    if (videoFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(videoFile);
      link.download = videoFile.name || 'downloaded_video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getCurrentAndTotalTime = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      return {
        current: formatTime(videoElement.currentTime),
        total: formatTime(videoElement.duration || 0)
      };
    }
    return { current: '0:00', total: '0:00' };
  };

  const { current: currentTime, total: totalTime } = getCurrentAndTotalTime();

  const getEmbedUrl = (url) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const tiktokRegex = /(?:https?:\/\/)?(?:(?:www|vm)\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)/;
    const tiktokMatch = url.match(tiktokRegex);
    if (tiktokMatch) {
      return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoSrc);
  const isDefaultVideo = videoSrc === 'https://youtu.be/RgcOQo-Ty_I';
  const showDownload = videoFile && !isDefaultVideo && !embedUrl.includes('youtube.com/embed') && !embedUrl.includes('tiktok.com/embed');

  return (
    <VideoContainer>
      <PlayerWrapper>
        <VideoWrapper
          fullScreen={isFullScreen}
          error={videoError}
          type={videoType}
        >
          {videoError ? (
            <ErrorOverlay>
              <p>Не вдалося завантажити відео</p>
            </ErrorOverlay>
          ) : (
            embedUrl.includes('youtube.com/embed') || embedUrl.includes('tiktok.com/embed') ? (
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="Embedded Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={updateProgress}
              />
            )
          )}
        </VideoWrapper>

        {!embedUrl.includes('youtube.com/embed') && !videoError && (
          <ControlsContainer>
            <ControlRow>
              <ControlButton onClick={handlePlayPause}>
                {isPlaying ? <PauseCircle /> : <PlayCircle />}
              </ControlButton>

              <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '20px' }}>
                <span>{currentTime}</span>///<span>{totalTime}</span>
                <TimeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {volume > 0 ? <Volume2 /> : <VolumeX />}
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />

                <ControlButton onClick={handleFullScreen}>
                  {isFullScreen ? <Minimize2 /> : <Maximize2 />}
                </ControlButton>
              </div>
            </ControlRow>
          </ControlsContainer>
        )}
      </PlayerWrapper>

      {!isDefaultVideo && (
        <ControlButtonsContainer>
          <CircleButton onClick={resetToDefaultVideo} title="Reset">
            <RefreshCcw />
          </CircleButton>
          {showDownload && (
            <CircleButton onClick={handleDownload} title="Download">
              <Download />
            </CircleButton>
          )}
        </ControlButtonsContainer>
      )}
    </VideoContainer>
  );
};

export default VideoPlayer;