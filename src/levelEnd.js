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
        this.image = new Image();
        this.image.src = "img/mainframe.png";

        this.render = this.render.bind(this);
    }



    render() {
        this.game.ctx.save();
        this.game.ctx.drawImage(this.image,this.position.x, this.position.y, this.width, this.height);
        this.game.ctx.restore();
    }
}