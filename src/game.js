import Player from "./player";

export default class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 700;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(this);
    }

    render() {
        this.player.render();
    }

    update(){

    }
}