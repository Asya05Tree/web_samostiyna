import React from 'react';
import { ThemeProvider } from 'styled-components';
import { VideoProvider } from './components/contexts/VideoContext';
import { GlobalStyle, theme } from './globalStyles';
import Header from './components/header/Header';
import VideoPlayer from './components/main/videoPlayer/VideoPlayer';
import VideoUploader from './components/main/videoUploader/VideoUploader';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <VideoProvider>
          <div className="app">
            <Header />
            <main>
              <VideoPlayer />
              <VideoUploader />
            </main>
          </div>
        </VideoProvider>
      </>
    </ThemeProvider>
  );
}

export default App;