export default class Bullet {
    constructor (game) {
        this.game = game;
        this.position = {
            x: game.finalEnemy.orientation === 'right' ? (game.finalEnemy.position.x + 4*game.map.tileWidth) : (game.finalEnemy.position.x - game.map.tileWidth),
            y: game.finalEnemy.position.y + 2*game.map.tileHeight
        };
        this.velocity = {
            x: game.finalEnemy.orientation === 'right' ? 3 : -3,
            y: 0
        };
        this.width = game.map.tileWidth;
        this.height = game.map.tileHeight;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isOnCamera = this.isOnCamera.bind(this);
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
            return 'out';
        }

        else if (sideHit && !this.game.player.hitted) {
            this.game.player.hitted=true;
            this.game.gameState.lives--;
        }
    }

    update(){
        if(this.checkPlayerCollision() === 'out'){
            return 'out';
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (!this.isOnCamera(1, 2)) {
            return 'out';
        }
    }

    render(){
        var tileHeight = this.game.map.tileHeight;
        var tileWidth = this.game.map.tileWidth;

        this.game.ctx.save();

        this.game.ctx.fillStyle = "orange";
        this.game.ctx.fillRect(this.position.x, this.position.y, tileWidth, tileHeight);

        this.game.ctx.restore();
    }
}