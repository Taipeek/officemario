import './index.css';
import Game from "./game";

var game = new Game();
window.onload = () => game.render();