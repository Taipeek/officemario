export default class Player {
    constructor(game) {
        this.game = game;
        this.playerData = this.game.map.mapData.layers[1];
        this.position = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.maxVelocity = {x: 5, y: 3};
        this.width = {current: 0, initial: 0};
        this.height = {current: 0, initial: 0};
        this.moveForce = {current: 2, initial: 2};
        this.jumpForce = {current: 7, initial: 7};
        this.gravity = {current: 0.2, initial: 0.2};
        this.frictionCoef = {current: 0.98, initial: 0.98, braking: 0.7};
        this.playerData.objects.forEach(item => {
            if (item.name === "spawnpoint") {
                this.position.x = item.x;
                this.position.y = item.y;
                this.width.initial = this.width.current = item.width;
                this.height.initial = this.height.current = item.height;
            }
        });
        this.getTileXY = this.getTileXY.bind(this);
        this.jumpCrouch = this.jumpCrouch.bind(this);
        this.move = this.move.bind(this);
        this.applyMovement = this.applyMovement.bind(this);
        this.checkHorizontalCollision = this.checkHorizontalCollision.bind(this);
        this.checkVerticalCollision = this.checkVerticalCollision.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
    }

    getTileXY(vertical, horizontal) { //TODO horizontal position of tiles... now just assumint the middle of the player.
        if (vertical === "lower") {
            return {
                x: Math.floor((this.position.x + this.width.current / 2) / this.game.map.tileWidth),
                y: Math.floor((this.position.y + this.height.current) / this.game.map.tileHeight)
            }
        }
        else {
            return {
                x: Math.floor((this.position.x + this.width.current / 2) / this.game.map.tileWidth),
                y: Math.floor((this.position.y) / this.game.map.tileHeight)
            }
        }
    }

    jumpCrouch() {
        //jump
        if (this.velocity.y === 0 && this.game.keyBoard['up']) //not sure if this will work correctly
            this.velocity.y = -this.jumpForce.current;

        //crouch
        if (this.game.keyBoard['down']) {
            if (this.height.current === this.height.initial) {
                this.height.current = this.height.initial / 2;
                this.position.y += this.height.current;
            }
        }
        else if (this.height.current < this.height.initial) {
            this.height.current = this.height.initial;
            this.position.y -= this.height.current / 2;
        }
    }

    move() {
        if (this.game.keyBoard['left']) {
            this.velocity.x -= this.moveForce.current;
        }
        else if (this.game.keyBoard['right']) {
            this.velocity.x += this.moveForce.current;
        }

        if (Math.abs(this.velocity.x) > this.maxVelocity.x)
            this.velocity.x = Math.sign(this.velocity.x) * this.maxVelocity.x;

        this.velocity.y += this.gravity.current;

    }

    applyMovement() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (!this.game.keyBoard["right"] && !this.game.keyBoard["left"]) {
            this.velocity.x *= this.frictionCoef.braking;
        }

    }

    checkHorizontalCollision() {
        //TODO
    }

    checkVerticalCollision() {
        let lowerTilePosition = this.getTileXY("lower");
        let upperTilePosition = this.getTileXY("upper");
        let lowerCurrentTile = this.game.map.tileAt(lowerTilePosition.x, lowerTilePosition.y, 0);
        let upperCurrentTile = this.game.map.tileAt(upperTilePosition.x, upperTilePosition.y, 0);

        if (lowerCurrentTile && lowerCurrentTile.solid) {
            this.velocity.y = 0;
            this.position.y = this.game.map.tileHeight * lowerTilePosition.y - this.height.current;
            console.log(this.position, upperTilePosition);
        }

        if (upperCurrentTile && upperCurrentTile.solid) {
            this.velocity.y = 0.000000001; //hack for not jumping again
            this.position.y = this.game.map.tileHeight * (upperTilePosition.y + 1);
            console.log(this.position, upperTilePosition);
        }

        if (!lowerCurrentTile) {
            this.game.pause();
            console.log('out of map');
        }


    }


    render() {
        this.game.ctx.save();
        this.game.ctx.fillStyle = "beige";
        this.game.ctx.fillRect(this.position.x, this.position.y, this.width.current, this.height.current);
        this.game.ctx.restore();
    }

    update() {
        this.jumpCrouch();
        this.move();
        this.applyMovement();
        this.checkHorizontalCollision();
        this.checkVerticalCollision();
    }
}