import Powerup from "./powerup";

export default class Player {
    constructor(game) {
        this.game = game;
        this.position = {x: 0, y: 0};
        this.width = {current: 32, initial: 32};
        this.height = {current: 64, initial: 64};
        this.imageWalk = {normal: new Image(), invincible: new Image()};
        this.imageWalk.normal.src = "img/player_walk_sheet.png";
        this.imageWalk.invincible.src = "img/player_walk_sheet_godmode.png";
        this.imageJump = {normal: new Image(), invincible: new Image()};
        this.imageJump.normal.src = "img/Fat_jump_right.png";
        this.imageJump.invincible.src = "img/Fat_jump_right_godmode.png";
        this.lastDirection = "r";
        this.animation = 0;
        this.getTileXY = this.getTileXY.bind(this);
        this.getTileXYHorizontal = this.getTileXYHorizontal.bind(this);
        this.jumpCrouch = this.jumpCrouch.bind(this);
        this.move = this.move.bind(this);
        this.applyMovement = this.applyMovement.bind(this);
        this.checkTileCollision = this.checkTileCollision.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.prepareSounds();
        this.initialize();
    }

    initialize() {
        this.velocity = {x: 0, y: 0};
        this.maxVelocity = {x: 4, y: 4};
        this.moveForce = {current: 1.7, initial: 1.7};
        this.jumpForce = {current: 11, initial: 11};
        this.gravity = {current: 0.4, initial: 0.4};
        this.frictionCoef = {current: 0.98, initial: 0.98, braking: 0.7};
        this.invincible = false;
        this.hitted = false; // when player loses hp, he is immortal for some time
        this.timeHitted = 0;
        this.prepareSpawnpoints()
    }

    playHitSound() {
        if (this.game.gameState.lives > 0) {
            this.sounds.hit.volume = this.game.maxVolume;
            this.sounds.hit.play();
        }
        else {
            this.sounds.death.volume = this.game.maxVolume;
            this.sounds.death.play();
        }
    }

    prepareSounds() {
        // https://opengameart.org/content/male-gruntyelling-sounds
        // 3grunt1.wav, shortened in the beginning
        this.sounds = {
            hit: null,
            jump: null,
            crouch: null,
            pspawn: null,
            death: null
        };

        this.sounds.hit = new Audio('sounds/yell.wav');
        this.sounds.hit.load();
        this.sounds.hit.volume = this.game.maxVolume;
        // bfxr
        this.sounds.jump = new Audio('sounds/jump.wav');
        this.sounds.jump.load();
        this.sounds.jump.volume = this.game.maxVolume;
        // bfxr
        this.sounds.pspawn = new Audio('sounds/pspawn.wav');
        this.sounds.pspawn.load();
        this.sounds.pspawn.volume = this.game.maxVolume;

        this.moonwalk = {on: false, music: null, start: 0};
        this.moonwalk.music = new Audio('sounds/smooth.wav');
        this.moonwalk.music.load();
        this.moonwalk.music.loop = true;
        this.moonwalk.music.volume = this.game.maxVolume / 10;
        this.moonwalk.music.currentTime = 0;

        this.sounds.crouch = new Audio('sounds/fart.wav');
        this.sounds.crouch.load();
        this.sounds.crouch.volume = this.game.maxVolume;

        this.sounds.death = new Audio('sounds/death.wav');
        this.sounds.death.load();
        this.sounds.death.volume = this.game.maxVolume;
    }

    prepareSpawnpoints() {
        this.powerupSpawns = [];
        let objectLayer = this.game.map.mapData.layers[2];

        objectLayer.objects.forEach(item => {
            if (item.type === 'tilepowerup') {
                // align x and y coordinates to non-weird values
                let cleanX = Math.floor(item.x / this.game.map.tileWidth) * this.game.map.tileWidth;
                let cleanY = Math.floor(item.y / this.game.map.tileHeight) * this.game.map.tileHeight;
                item.x = cleanX;
                item.y = cleanY;
                item.tilePos = {
                    x: item.x / this.game.map.tileWidth,
                    y: item.y / this.game.map.tileHeight
                };
                this.powerupSpawns.push(item);
            }
        });
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
        if (this.velocity.y === 0 && this.game.keyBoard['up']) {//not sure if this will work correctly
            this.velocity.y = -this.jumpForce.current;

            this.sounds.jump.volume = this.game.maxVolume / 3;
            this.sounds.jump.play();
        }

        //crouch
        if (this.game.keyBoard['down']) {
            if (this.height.current === this.height.initial) {
                this.sounds.crouch.currentTime=0;
                this.sounds.crouch.volume = this.game.maxVolume / 3;
                this.sounds.crouch.play();
            }
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
            if (this.position.x < 0)
                this.velocity.x = 0;
            else
                this.velocity.x -= this.moveForce.current;
        }
        else if (this.game.keyBoard['right']) {
            this.velocity.x += this.moveForce.current;
        }

        if (this.position.y < 0)
            this.velocity.y = 0;

        if (Math.abs(this.velocity.x) > this.maxVelocity.x)
            this.velocity.x = Math.sign(this.velocity.x) * this.maxVelocity.x;

        this.velocity.y += this.gravity.current;

    }

    triggerMusic() {
        this.moonwalk.on = (this.game.keyBoard["right"] && this.game.keyBoard["left"]);
        if (this.moonwalk.on && this.velocity.y === this.gravity.current) {
            this.moonwalk.music.volume = this.game.maxVolume / 10;
            this.moonwalk.music.currentTime = this.moonwalk.start;
            this.game.music.pause();
            this.moonwalk.music.play();
        }
        else {
            this.moonwalk.start = this.moonwalk.music.currentTime;
            this.moonwalk.music.pause();
            this.game.music.play();
        }
    }

    applyMovement() {
        if (Math.abs(this.velocity.x) < 1e-3)
            this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < 1e-3)
            this.velocity.y = 0;
        this.cameraMove = {x: Math.abs(Math.ceil(this.velocity.x)), y: Math.abs(Math.ceil(this.velocity.y))};
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.moonwalk.on !== (this.game.keyBoard["right"] && this.game.keyBoard["left"])) {
            this.triggerMusic();
        }

        if (!this.game.keyBoard["right"] && !this.game.keyBoard["left"]) {
            this.velocity.x *= this.frictionCoef.braking;
        }

        //move he screen if necessary
        let sWidth = this.game.canvas.width;
        let sHeight = this.game.canvas.height;
        let sTreshhold = {x: sWidth / 3.4, y: sHeight / 4};
        let pPosition = {
            x: this.position.x - this.game.screenPosition.x,
            y: this.position.y - this.game.screenPosition.y
        };
        if (pPosition.x > sWidth - sTreshhold.x) {
            this.game.moveScreen("right", this.cameraMove.x);
        } else if (pPosition.x < sTreshhold.x) {
            this.game.moveScreen("left", this.cameraMove.x);
        }

        if (pPosition.y > sHeight - sTreshhold.y) {
            this.game.moveScreen("down", this.cameraMove.y);
        } else if (pPosition.y < sTreshhold.y) {
            this.game.moveScreen("up", this.cameraMove.y);
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
            // console.log("top");

            this.checkPowerupSpawn(upperLeftTilePosition, upperRightTilePosition);
        }

        lowerLeftTilePosition = this.getTileXYHorizontal("lower", "left");
        lowerRightTilePosition = this.getTileXYHorizontal("lower", "right");
        upperLeftTilePosition = this.getTileXYHorizontal("upper", "left");
        upperRightTilePosition = this.getTileXYHorizontal("upper", "right");
        lowerLeftCurrentTile = this.game.map.tileAt(lowerLeftTilePosition);
        lowerRightCurrentTile = this.game.map.tileAt(lowerRightTilePosition);
        upperLeftCurrentTile = this.game.map.tileAt(upperLeftTilePosition);
        upperRightCurrentTile = this.game.map.tileAt(upperRightTilePosition);
        // horizontal detection left
        if ((lowerLeftCurrentTile && lowerLeftCurrentTile.solid) || (upperLeftCurrentTile && upperLeftCurrentTile.solid)) {
            this.velocity.x = 0;
            this.position.x = this.game.map.tileWidth * (lowerLeftTilePosition.x + 1);
            // console.log("left");
        }
        // horizontal detection right
        if ((lowerRightCurrentTile && lowerRightCurrentTile.solid) || (upperRightCurrentTile && upperRightCurrentTile.solid)) {
            this.velocity.x = 0;
            this.position.x = this.game.map.tileWidth * (upperRightTilePosition.x) - this.width.current;
            // console.log("right");
        }
        // horizontal detection middle
        if (lowerLeftTilePosition.y - upperLeftTilePosition.y > 1) {
            let diff = lowerLeftTilePosition.y - upperLeftTilePosition.y;
            let rightPos = {x: upperRightTilePosition.x, y: upperRightTilePosition.y + 1};
            let rightTile = this.game.map.tileAt(rightPos);
            let leftPos = {x: upperLeftTilePosition.x, y: upperLeftTilePosition.y + 1};
            let leftTile = this.game.map.tileAt(leftPos);

            if (rightTile && rightTile.solid) {
                this.velocity.x = 0;
                this.position.x = this.game.map.tileWidth * (rightPos.x) - this.width.current;
                // console.log("right_m");
            } else if (leftTile && leftTile.solid) {
                this.velocity.x = 0;
                this.position.x = this.game.map.tileWidth * (leftPos.x + 1);
                // console.log("left_m");
            }
        }

        if (!lowerLeftCurrentTile && !lowerRightCurrentTile) {
            //this.game.pause();
            this.moonwalk.music.pause();
            console.log('out of map');
            this.game.gameState.lives = 0;
        }
    }

    checkPowerupSpawn(upperLeft, upperRight) {
        for (let i = 0; i < this.powerupSpawns.length; i++) {
            let spawn = this.powerupSpawns[i];

            if ((spawn.tilePos.x === upperLeft.x && spawn.tilePos.y === upperLeft.y) ||
                (spawn.tilePos.x === upperRight.x && spawn.tilePos.y === upperRight.y)) {
                //console.log('powerup should get spawned, ' + spawn.tilePos.x + ' ' + spawn.tilePos.y);
                this.game.powerups.push(new Powerup(this.game, spawn.x, spawn.y - this.game.map.tileHeight, null));

                this.sounds.pspawn.volume = this.game.maxVolume / 3;
                this.sounds.pspawn.play();
                this.powerupSpawns.splice(i, 1); // "deactivate" the spawnpoint
                return;
            }
        }
    }


    render() {
        if (this.timeHitted % 10 > 5) {
            return;
        }
        this.game.ctx.save();
        if (this.game.keyBoard['right']) {
            if (!(this.game.renderCounter % 4))
                this.animation = (this.animation + 1) % 8;
            this.direction = "r";
        } else if (this.game.keyBoard['left']) {
            if (!(this.game.renderCounter % 4))
                this.animation = (this.animation + 1) % 8;
            this.direction = "l";
        } else {
            this.animation = 0;
        }

        this.game.ctx.translate(this.position.x + this.width.current / 2, this.position.y + this.height.current / 2);
        if (this.direction === "l") {
            this.game.ctx.scale(-1, 1);
        }
        if (this.velocity.y === 0) {
            this.game.ctx.drawImage((this.invincible ? this.imageWalk.invincible :this.imageWalk.normal), this.width.initial * this.animation, 0, this.width.initial, this.height.initial, -this.width.current / 2, -this.height.current / 2, this.width.current, this.height.current)
        } else {
            this.game.ctx.drawImage((this.invincible ? this.imageJump.invincible :this.imageJump.normal), -this.width.current / 2, -this.height.current / 2, this.width.current, this.height.current)
        }
        this.game.ctx.restore();
    }

    update() {
        //console.log(this.position);
        this.jumpCrouch();
        this.move();
        this.applyMovement();
        this.checkTileCollision();
        if (this.hitted) {
            this.timeHitted++;
        }
        if (this.timeHitted > 100) {
            this.hitted = false;
            this.timeHitted = 0;
        }
    }
}
