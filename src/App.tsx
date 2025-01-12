import { useEffect } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config';
import './App.css';

function App() {
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div id="game"></div>
  );
}

export default App;
