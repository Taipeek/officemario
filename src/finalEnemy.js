import Bullet from "./bullet";

export default class FinalEnemy {
    constructor (game, x, y, orientation) {
        this.game = game;
        this.position = {
            x: x,
            y: y
        };
        this.calcTilePosition = this.calcTilePosition.bind(this);
        this.tilePos = this.calcTilePosition(this.position);
        this.orientation = orientation;
        switch (this.game.gameState.level) {
            case 1:
                this.img = "TODO blue screen"; //TODO image of blue screen
                this.bulletImg = "TODO bullet img"; //TODO image of bullets
                this.shootInterval = 200;
                this.lives = 4;
                break;
            case 2:
                this.img = "TODO level 2 enemy"; //TODO image of blue screen
                this.bulletImg = "TODO bullet img of level 2 enemy"; //TODO image of bullets
                this.shootInterval = 90;
                this.lives = 5;
                break;
        }
        this.visible = false;
        this.lastShot = -1;
        this.bullets = [];
        this.width = this.game.map.tileWidth*4;
        this.height = this.game.map.tileHeight*4;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isOnCamera = this.isOnCamera.bind(this);
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.tileWidth / 2) / this.tileWidth);
        let y = Math.floor((position.y + this.tileHeight / 2) / this.tileHeight);
        return {x: x, y: y};
    }

    checkPlayerCollision() {
        let player = this.game.player;

        let topHit = (
            (player.velocity.y > 0)
            && (this.position.x > player.position.x - this.width)
            && (this.position.x < player.position.x + this.width)
            && (this.position.y <= player.position.y + player.height.current)
            && (this.position.y + 1/4*this.position.y > player.position.y + player.height.current)
        );

        let sideHit = (
            (this.position.x < player.position.x + player.width.current)
            && (this.position.x > player.position.x - this.width)
            && (this.position.y > player.position.y - this.height)
            && (this.position.y < player.position.y + player.height.current)
        );

        if (topHit) {	//bullet destroyed
            if(this.lives === 1) {
                console.log("KILLED");
            }
            this.lives--;
        }

        else if (sideHit && !this.game.player.hitted) {
            this.game.player.hitted=true;
            this.game.gameState.lives--;
        }
    }

    isOnCamera (vertBeyond, horBeyond) {
        var camera = {
            x: this.game.screenPosition.x,
            y: this.game.screenPosition.y
        };

        if (
            ((camera.x + this.game.canvas.width * horBeyond) > this.position.x)
            && ((camera.x - this.game.canvas.width * (horBeyond - 1)) < this.position.x)
            && ((camera.y + this.game.canvas.height * vertBeyond) > this.position.y)
            && ((camera.y - this.game.canvas.height * (vertBeyond -1)) < this.position.y)
        ) {
            return true;
        }
        return false;
    }

    update(){
        //if enemy is very close to camera

        if (this.isOnCamera(1, 1.5)){
            this.visible = true;

            this.checkPlayerCollision();

            if(this.lastShot < 0){
                this.bullets.push(new Bullet(this.game));
                this.lastShot = this.shootInterval;
            }
            this.lastShot--;

            for(let i = this.bullets.length-1; i > -1; i--) {
                if (this.bullets[i].update() === 'out'){
                    this.bullets.splice(i, 1);
                }
            }

        } else {
            this.visible = false;
        }
    }

    render() {
        if (!this.visible) {
            return;
        }
        this.game.ctx.save();
        this.game.ctx.fillStyle = "blue";
        /* TODO use img of the final enemy */
        this.game.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        let text = "not yet ready final enemy";
        this.game.ctx.fillStyle = "white";
        this.game.ctx.fillText(text, this.position.x + this.width/2 - this.game.ctx.measureText(text).width/2,
            this.position.y + this.height/2);

        this.game.ctx.restore();

        for(let i = this.bullets.length-1; i > -1; i--) {
            this.bullets[i].render();
        }
    }
}