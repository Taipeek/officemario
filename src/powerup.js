export default class Powerup {
    constructor(game, x, y, type) {
        this.game = game;
        this.type = (type ? type : this.randomType()); // default type for now
        this.active = true;
        this.applied = false;
        this.timeToLive = Math.floor((5 + Math.random() * 5) * this.game.framerate); // 5 to 10 seconds
        this.duration = Math.floor(10 * this.game.framerate); // the effects last for 10 seconds
        this.position = {x: x, y: y};
        this.gravity = 0.7;
        this.tilePos = this.calcTilePosition(this.position);
        this.tileWidth = this.game.map.tileWidth;
        this.tileHeight = this.game.map.tileHeight;
        this.velocity = {
            x: (Math.random() < 0.5 ? -1 : 1),
            y: -10 * this.gravity,
            max: this.tileHeight / 2
        };
        this.img = new Image();
        this.img.src = 'img/powerups/' + this.type + '.png';

        this.prepareSounds();

        //console.log('spawned ' + this.type + ' at ' + this.position.x + ' ' + this.position.y);
    }

    randomType() {
        return ['pizza', 'coffee', 'auto', 'debug'][Math.floor(Math.random() * 4)]
    }

    prepareSounds() {
        // https://www.sounds-resource.com/pc_computer/terraria/sound/2890/
        // we probably need free sounds, consider these placeholders

        let soundpath;
        switch (this.type) {
            case 'pizza':
                soundpath = 'crunch';
                break;
            case 'coffee':
                soundpath = 'gulp';
                break;
            default:
                soundpath = 'ppickup';
                break;
        }
        //console.log(soundpath);
        this.sound = new Audio('sounds/' + soundpath + '.wav');
        this.sound.load();
        this.sound.volume = this.game.maxVolume;
    }

    playSound() {
        if (this.sound) {
            this.sound.volume = this.game.maxVolume;
            this.sound.play();
        }
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.tileWidth / 2) / this.tileWidth);
        let y = Math.floor((position.y + this.tileHeight / 2) / this.tileHeight);
        return {x: x, y: y};
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.tilePos = this.calcTilePosition(this.position);
    }

    checkTileCollisions() {
        // check collision with tiles below the lower-left and lower-right corner of the tile
        let belowTilePositionL = {x: Math.floor(this.position.x / this.tileWidth), y: this.tilePos.y + 1};
        let belowTileL = this.game.map.tileAt(belowTilePositionL, 0);

        let belowTilePositionR = {
            x: Math.floor((this.position.x + this.tileWidth) / this.tileWidth),
            y: this.tilePos.y + 1
        };
        let belowTileR = this.game.map.tileAt(belowTilePositionR, 0);

        if (belowTileL && belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.y = 0;
            this.position.y = (belowTilePositionL.y - 1) * this.tileHeight;
        }
        else if (belowTileR && belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.y = 0;
            this.position.y = (belowTilePositionR.y - 1) * this.tileHeight;
        }
        else {
            this.velocity.y += this.gravity;
            if (this.velocity.y > this.velocity.max)
                this.velocity.y = this.velocity.max;

            if (this.velocity.y < -this.velocity.max) // should never happen, objects don't fly up
                this.velocity.y = -this.velocity.max;
        }

        // check collision from the left
        let leftTilePosition = {x: this.tilePos.x - 1, y: this.tilePos.y};
        let leftTile = this.game.map.tileAt(leftTilePosition, 0);
        if (leftTile && leftTile.solid && (this.position.x - ((leftTilePosition.x + 1) * this.tileWidth)) < 0) {
            //console.log("colliding from the left side with " + leftTilePosition.x + " " + leftTilePosition.y);
            this.velocity.x *= -1;
            return;
        }
        let rightTilePosition = {x: this.tilePos.x + 1, y: this.tilePos.y};
        let rightTile = this.game.map.tileAt(rightTilePosition, 0);
        if (rightTile && rightTile.solid && ((rightTilePosition.x * this.tileWidth) - (this.position.x + this.tileWidth)) < 0) {
            //console.log("colliding from the right side with " + rightTilePosition.x + " " + rightTilePosition.y);
            this.velocity.x *= -1;
            return;
        }
    }

    checkPlayerCollision() {
        let player = this.game.player;

        // the player hits the powerup from the left (with his right side)
        let leftHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x + player.width.current
            && this.position.x >= player.position.x);

        // the player hits the powerup with his left side
        let rightHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x
            && this.position.x + this.tileWidth >= player.position.x);

        if (leftHit || rightHit) {
            this.apply();
            this.active = false;
        }
    }

    apply() {
        this.applied = true;
        this.game.gameState.score += 1;
        switch (this.type) {
            case 'debug':
                this.game.player.invincible = true;
                break;
            case 'auto':
                if (this.game.player.maxVelocityInitial.x >= this.game.player.maxVelocity.x) {
                    this.game.player.maxVelocity.x += 2;
                    this.game.player.maxVelocity.y += 2;
                    this.game.player.jumpForce.current = 14.1;
                }
                break;
            case 'coffee':
                this.game.gameState.lives++;
                this.game.shake = {
                    on: (Math.random() < 0.75), // 75% chance that the screen will shake
                    rampdown: false,
                    counter: this.duration
                };
                break;
            case 'pizza':
                this.game.gameState.lives++;
                this.game.player.maxVelocity.x -= 2;
                break;
            default:
                console.log("unknown powerup type: " + this.type);
                return;
        }
        this.playSound();
    }

    wearoff() {
        this.applied = false;
        switch (this.type) {
            case 'debug':
                this.game.player.invincible = false;
                break;
            case 'auto':
                if (this.game.player.maxVelocityInitial.x < this.game.player.maxVelocity.x) {
                    this.game.player.maxVelocity.x -= 2;
                    this.game.player.maxVelocity.y -= 2;
                    this.game.player.jumpForce.current = this.game.player.jumpForce.initial;
                }
                break;
            case 'coffee':
                this.game.shake.on = false;
                break;
            case 'pizza':
                if (this.game.player.maxVelocity.x < this.game.player.maxVelocityInitial.x)
                    this.game.player.maxVelocity.x += 2;
                break;
            default:
                console.log("unknown powerup type: " + this.type);
                return;
        }
    }

    update() {
        if (this.applied) {
            this.duration -= 1;
            if (this.duration <= 0)
                this.wearoff();
            return;
        }
        if (!this.active)
            return;
        this.checkTileCollisions();
        this.checkPlayerCollision();
        this.move();

        //this.timeToLive -= 1;
        if (this.timeToLive <= 0)
            this.active = false;
    }

    render() {
        //debug - comment the whole block below
        /*if (this.applied) {            
            this.game.ctx.save();
            let text = 'frames left: ' + this.duration;
            this.game.ctx.font = '14px Courier';
            this.game.ctx.fillText(text, 
                this.game.player.position.x + this.game.player.width.current/2 - this.game.ctx.measureText(text).width/2, 
                this.game.player.position.y - 10);
            this.game.ctx.restore();
        }*/

        if (!this.active)
            return;
        this.game.ctx.save();
        try {
            this.game.ctx.drawImage(this.img, this.position.x, this.position.y);
        } catch (e) { // no image found - draw a red box with the powerup type on it
            //console.log(e);
            this.game.ctx.fillStyle = 'red';
            this.game.ctx.fillRect(this.position.x, this.position.y, this.tileWidth, this.tileHeight);
            let text = this.type;
            this.game.ctx.fillStyle = 'white';
            this.game.ctx.fillText(text, this.position.x + this.tileWidth / 2 - this.game.ctx.measureText(text).width / 2,
                this.position.y + this.tileHeight / 2);
        }

        this.game.ctx.restore();
    }
}