import React, {useEffect} from 'react';
import {HoveringControls} from '../components'
import {initiateGame} from '../../game/phaser'
import './App.css';
import 'antd/dist/antd.css';

export const App = () => {
  useEffect(() => {
    initiateGame()
  })
  return (
    <HoveringControls />
  );
}

