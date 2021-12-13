import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './frontend/app/App'
import { createGlobalStyle } from 'styled-components'
import './game/phaser'

const GlobalStyle = createGlobalStyle`
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
body {
  margin: 0;
  padding: 0;
  background-color: black;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

`

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
