export default class Bullet {
    constructor(game, orientation, num) {
        this.id = Math.random();
        this.game = game;
        this.img = game.finalEnemy.bulletImg;
        switch (orientation) {
            case 'left':
                this.position = {
                    x: (game.finalEnemy.position.x - game.map.tileWidth),
                    y: game.finalEnemy.position.y + game.finalEnemy.height / 2
                };
                this.velocity = {
                    x: -3,
                    y: 0
                };
                break;
            case 'right':
                this.position = {
                    x: (game.finalEnemy.position.x + 4 * game.map.tileWidth),
                    y: game.finalEnemy.position.y + game.finalEnemy.height / 2
                };
                this.velocity = {
                    x: 3,
                    y: 0
                };
                break;
            case 'top':
                this.position = {
                    x: (game.finalEnemy.position.x + num * game.map.tileWidth),
                    y: game.finalEnemy.position.y
                };
                this.velocity = {
                    x: 0,
                    y: -3
                };
                break;

        }

        this.width = 2 * game.map.tileWidth;
        this.height = game.map.tileHeight;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isOnCamera = this.isOnCamera.bind(this);
        this.calcTilePosition = this.calcTilePosition.bind(this);
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.width / 2) / this.game.map.tileWidth);
        let y = Math.floor((position.y + this.height / 2) / this.game.map.tileHeight);
        return {x: x, y: y};
    }

    isOnCamera(vertBeyond, horBeyond) {
        let camera = {
            x: this.game.screenPosition.x,
            y: this.game.screenPosition.y
        };

        return ((camera.x + this.game.canvas.width * horBeyond) > this.position.x)
            && ((camera.x - this.game.canvas.width * (horBeyond - 1)) < this.position.x)
            && ((camera.y + this.game.canvas.height * vertBeyond) > this.position.y)
            && ((camera.y - this.game.canvas.height * (vertBeyond - 1)) < this.position.y);

    }

    checkPlayerCollision() {
        let tile = this.game.map.tileAt(this.calcTilePosition(this.position));
        if (tile && tile.solid) return 'out';

        let player = this.game.player;

        let topHit = (
            this.velocity.y === 0 &&
            player.velocity.y > 0
            && (player.position.x < this.position.x + this.width)
            && (player.position.x + player.width.current > this.position.x)
            && (player.position.y + player.height.current > this.position.y)
            && (player.position.y + player.height.current / 2 < this.position.y)
        );

        let sideHit = (
            (this.position.x < player.position.x + player.width.current)
            && (this.position.x > player.position.x - this.width)
            && (this.position.y > player.position.y - this.height)
            && (this.position.y < player.position.y + player.height.current)
        );

        if (topHit) {	//bullet destroyed
            console.log("top");
            return 'out';
        }

        else if (sideHit && !this.game.player.hitted && !this.game.player.invincible) {
            this.game.player.hitted = true;
            this.game.gameState.lives--;
            this.game.player.playHitSound();
        }
    }

    update() {
        if (this.checkPlayerCollision() === 'out') {
            return 'out';
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (!this.isOnCamera(1, 2)) {
            return 'out';
        }
    }

    render() {
        var tileHeight = this.game.map.tileHeight;
        var tileWidth = this.game.map.tileWidth;

        this.game.ctx.save();

        if (this.img) {
            this.game.ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        } else {

            this.game.ctx.fillStyle = "orange";
            this.game.ctx.fillRect(this.position.x, this.position.y, tileWidth, tileHeight);
        }
        this.game.ctx.restore();
    }
}
