import Bullet from "./bullet";

export default class LevelEnd {
    constructor(game, x, y, width,height) {
        this.game = game;
        this.position = {
            x: x,
            y: y
        };
        this.width = width;
        this.height= height;

        this.render = this.render.bind(this);
    }



    render() {
        this.game.ctx.save();
        this.game.ctx.fillStyle = "blue";
        /* TODO use img of the final enemy */
        this.game.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        let text = "next level";
        this.game.ctx.fillStyle = "white";
        this.game.ctx.fillText(text, this.position.x + this.width / 2 - this.game.ctx.measureText(text).width / 2,
            this.position.y + this.height / 2);
        this.game.ctx.restore();
    }
}