export default class Player {
    constructor(game) {
        this.game = game;
        this.playerData = this.game.map.mapData.layers[2];
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
            if (item.type === "playerSpawn") {
                this.position.x = item.x;
                this.position.y = item.y;
                this.width.initial = this.width.current = item.width;
                this.height.initial = this.height.current = item.height;
            }
        });
        this.getTileXY = this.getTileXY.bind(this);
        this.getTileXYHorizontal = this.getTileXYHorizontal.bind(this);
        this.jumpCrouch = this.jumpCrouch.bind(this);
        this.move = this.move.bind(this);
        this.applyMovement = this.applyMovement.bind(this);
        this.checkTileCollision = this.checkTileCollision.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
    }

    getTileXY(vertical, horizontal) {
        if (horizontal === "middle") {
            if (vertical === "lower") {
                return {
                    x: Math.floor((this.position.x + this.width.current / 2) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + this.height.current) / this.game.map.tileHeight)
                }
            }
            else if (vertical === "upper") {
                return {
                    x: Math.floor((this.position.x + this.width.current / 2) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y) / this.game.map.tileHeight)
                }
            }
        }
        else if (horizontal === "left") {
            if (vertical === "lower") {
                return {
                    x: Math.floor((this.position.x + 5) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + this.height.current ) / this.game.map.tileHeight)
                }
            }
            else if (vertical === "upper") {
                return {
                    x: Math.floor((this.position.x + 5) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y) / this.game.map.tileHeight)
                }
            }

        } else if (horizontal === "right") {
            if (vertical === "lower") {
                return {
                    x: Math.floor((this.position.x + this.width.current - 5) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + this.height.current ) / this.game.map.tileHeight)
                }
            }
            else if (vertical === "upper") {
                return {
                    x: Math.floor((this.position.x + this.width.current - 5) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y ) / this.game.map.tileHeight)
                }
            }
        }
    }

    getTileXYHorizontal(vertical, horizontal) {
        if (horizontal === "left") {
            if (vertical === "lower") {
                return {
                    x: Math.floor((this.position.x) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + this.height.current - 5) / this.game.map.tileHeight)
                }
            }
            else if (vertical === "upper") {
                return {
                    x: Math.floor((this.position.x) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + 5) / this.game.map.tileHeight)
                }
            }

        } else if (horizontal === "right") {
            if (vertical === "lower") {
                return {
                    x: Math.floor((this.position.x + this.width.current) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + this.height.current - 5 ) / this.game.map.tileHeight)
                }
            }
            else if (vertical === "upper") {
                return {
                    x: Math.floor((this.position.x + this.width.current) / this.game.map.tileWidth),
                    y: Math.floor((this.position.y + 5) / this.game.map.tileHeight)
                }
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


    checkTileCollision() {
        let lowerLeftTilePosition = this.getTileXY("lower", "left");
        let lowerRightTilePosition = this.getTileXY("lower", "right");
        let upperLeftTilePosition = this.getTileXY("upper", "left");
        let upperRightTilePosition = this.getTileXY("upper", "right");
        let lowerLeftCurrentTile = this.game.map.tileAt(lowerLeftTilePosition);
        let lowerRightCurrentTile = this.game.map.tileAt(lowerRightTilePosition);
        let upperLeftCurrentTile = this.game.map.tileAt(upperLeftTilePosition);
        let upperRightCurrentTile = this.game.map.tileAt(upperRightTilePosition);

        // vertical detection bottom
        if ((lowerLeftCurrentTile && lowerLeftCurrentTile.solid) || (lowerRightCurrentTile && lowerRightCurrentTile.solid)) {
            this.velocity.y = 0;
            this.position.y = this.game.map.tileHeight * lowerLeftTilePosition.y - this.height.current;
            // console.log("bottom");
        }
        // vertical detection top
        if ((upperLeftCurrentTile && upperLeftCurrentTile.solid) || (upperRightCurrentTile && upperRightCurrentTile.solid)) {
            this.velocity.y = 0.000000001; //hack for not jumping again
            this.position.y = this.game.map.tileHeight * (upperLeftTilePosition.y + 1);
            console.log("top");
        }

        lowerLeftTilePosition = this.getTileXYHorizontal("lower", "left");
        lowerRightTilePosition = this.getTileXYHorizontal("lower", "right");
        upperLeftTilePosition = this.getTileXYHorizontal("upper", "left");
        upperRightTilePosition = this.getTileXYHorizontal("upper", "right");
        lowerLeftCurrentTile = this.game.map.tileAt(lowerLeftTilePosition, 0);
        lowerRightCurrentTile = this.game.map.tileAt(lowerRightTilePosition, 0);
        upperLeftCurrentTile = this.game.map.tileAt(upperLeftTilePosition, 0);
        upperRightCurrentTile = this.game.map.tileAt(upperRightTilePosition, 0);
        // horizontal detection left
        if ((lowerLeftCurrentTile && lowerLeftCurrentTile.solid) || (upperLeftCurrentTile && upperLeftCurrentTile.solid)) {
            this.velocity.x = 0;
            this.position.x = this.game.map.tileWidth * (lowerLeftTilePosition.x + 1);
            console.log("left");
        }
        // horizontal detection right
        if ((lowerRightCurrentTile && lowerRightCurrentTile.solid) || (upperRightCurrentTile && upperRightCurrentTile.solid)) {
            this.velocity.x = 0;
            this.position.x = this.game.map.tileWidth * (upperRightTilePosition.x) - this.width.current;
            console.log("right");
        }
        // horizontal detection middle
        if (lowerLeftTilePosition.y - upperLeftTilePosition.y > 1) {
            let diff = lowerLeftTilePosition.y - upperLeftTilePosition.y;
            let rightPos = {x: upperRightTilePosition.x, y: upperRightTilePosition.y + 1};
            let rightTile = this.game.map.tileAt(rightPos);
            let leftPos = {x: upperLeftTilePosition.x, y: upperLeftTilePosition.y + 1};
            let leftTile = this.game.map.tileAt(rightPos);
            // console.log(rightPos,leftPos,rightTile,leftTile);

            if (rightTile && rightTile.solid) {
                this.velocity.x = 0;
                this.position.x = this.game.map.tileWidth * (rightPos.x) - this.width.current;
            } else if (leftTile && leftTile.solid) {
                this.velocity.x = 0;
                this.position.x = this.game.map.tileWidth * (leftPos.x +1);
            }


        }


        if (!lowerLeftCurrentTile && !lowerRightCurrentTile) {
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
        this.checkTileCollision();
    }
}
