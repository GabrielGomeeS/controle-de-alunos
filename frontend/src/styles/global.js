// src/styles/global.js
import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  
  body {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }

  button {
    transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease;
  }

  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    opacity: 0.95;
  }
`;

export default Global;
