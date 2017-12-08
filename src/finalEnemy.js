export default class FinalEnemy {
    constructor (game, x, y) {
        this.game = game;
        this.position = {
            x: x,
            y: y
        };
        switch (game.gameState.level) {
            case 1:
                this.img = "TODO blue screen"; //TODO image of blue screen
                this.bulletImg = "TODO bullet img"; //TODO image of bullets
                this.shootInterval = 1000;
                this.lives = 4;
                break;
            case 2:
                this.img = "TODO level 2 enemy"; //TODO image of blue screen
                this.bulletImg = "TODO bullet img of level 2 enemy"; //TODO image of bullets
                this.shootInterval = 500;
                this.lives = 5;
                break;
        }
        this.lastShot = 0;
        this.bullets = [];
    }

    update(){
        //if enemy is very close to camera
        if ((this.game.screenPosition.x < this.position.x * this.game.map.tileWidth + this.game.canvas.width * 1.2
            || this.position.x * this.game.map.tileWidth < this.game.screenPosition.x - this.game.canvas.width * 1.2)
            &&
            (this.game.screenPosition.y < this.position.y * this.game.map.tileHeight + this.game.canvas.height
            || this.position.y * this.game.map.tileHeight < this.game.screenPosition.y + this.game.canvas.height)){

            if(this.lastShot < 0){
                this.bullets.append(new Bullet())
                this.lastShot = this.shootInterval;
            }
        }
    }

    render() {
        this.game.ctx.save();

        this.game.ctx.fillStyle = "green";
        /* TODO use img of the final enemy */
        this.game.ctx.fillRect(this.position.x, this.position.y, this.tileWidth*4, this.tileHeight*4);

        this.game.ctx.restore();
    }
}