import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #121212, #1e1e2e);
    color: #e0e0e0;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  * {
    box-sizing: border-box;
    transition: all 0.3s ease;
  }
`;

export const theme = {
  colors: {
    background: '#121212',
    primary: '#bb86fc',
    secondary: '#03dac6',
    error: '#cf6679',
    text: '#e0e0e0',
  },
  shadows: {
    subtle: '0 4px 6px rgba(0,0,0,0.1)',
    neon: '0 0 10px rgba(187,134,252,0.5), 0 0 20px rgba(187,134,252,0.3)',
    button: '0 4px 6px rgba(0,0,0,0.2), 0 0 10px rgba(187,134,252,0.3)',
  },
};