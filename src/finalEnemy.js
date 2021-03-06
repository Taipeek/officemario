import Bullet from "./bullet";

export default class FinalEnemy {
    constructor(game, x, y, orientation, properties) {
        console.log(properties);
        this.game = game;
        this.position = {
            x: x,
            y: y
        };

        function* idMaker() {
            let index = 0;
            while (true)
                yield index++;
        }

        this.gen = idMaker();
        this.dead = false;
        this.level = properties.lvl;
        this.calcTilePosition = this.calcTilePosition.bind(this);
        this.tilePos = this.calcTilePosition(this.position);
        this.orientation = orientation;

        this.img = new Image();
        this.img.src = 'img/Blue_Screen_sad.png';
        this.bulletImg = new Image();
        this.bulletImg.src = 'img/error_window.png';
        this.shootInterval = 80;
        this.lives = 4;

        this.visible = false;
        this.fireworksCountDown = 130;
        this.lastShot = -1;
        this.bullets = [];
        this.width = properties.width;
        this.height = properties.height;
        console.log("width, height: " + this.width + ", " + this.height);

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isOnCamera = this.isOnCamera.bind(this);

        this.prepareSounds();
    }

    prepareSounds() {
        this.sounds = {shoot: [], death: null};
        this.game.maxVolume = 0.5;
        // good ol' Windows XP
        let paths = ['xp_critical_stop', 'xp_ding', 'xp_error', 'xp_exclamation'];
        paths.forEach(path => {
            try {
                let a = new Audio('sounds/' + path + '.wav');
                a.volume = this.game.maxVolume / 2;
                a.load();
                this.sounds.shoot.push(a);
            }
            catch (e) {
            }
        });

        this.sounds.death = new Audio('sounds/tada.wav');
        this.sounds.death.volume = this.game.maxVolume / 2;
        this.sounds.death.load();
    }

    playSound(type) {
        if (type === 'shoot') {
            let soundIndex = Math.floor(Math.random() * this.sounds.shoot.length);
            let volume = Math.abs(this.game.player.position.x - this.position.x);

            // the enemy gets louder the closer you are
            volume = ((volume > 800) ? 0 : (1 - volume / 800) * this.game.maxVolume);
            this.sounds.shoot[soundIndex].volume = volume;
            this.sounds.shoot[soundIndex].play();
        }
        else if (type === 'death') {
            this.sounds.death.volume = this.game.maxVolume / 2;
            this.sounds.death.play();
        }
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.game.map.tileWidth / 2) / this.game.map.tileWidth);
        let y = Math.floor((position.y + this.game.map.tileHeight / 2) / this.game.map.tileHeight);
        return {x: x, y: y};
    }

    checkPlayerCollision() {
        let player = this.game.player;

        let topHit = (
            ((player.position.x < this.position.x + this.width)
                && (player.position.x + player.width.current > this.position.x))
            && (player.position.y + player.height.current > this.position.y)
            && (player.position.y < this.position.y)
        );

        let sideHit = (
            (this.position.x < player.position.x + player.width.current)
            && (this.position.x > player.position.x - this.width)
            && (this.position.y > player.position.y - this.height)
            && (this.position.y < player.position.y - player.gravity.current + player.height.current)
        );

        if (topHit) {

            if (player.velocity.y > 2) {
                this.lives--;
                this.height -= this.game.map.tileHeight;
                this.position.y += this.game.map.tileHeight;
                // console.log(player.velocity.y, "AUCH, BOSS LOST A LIFE");
                if (this.lives === 0) {
                    // console.log("BOSS KILLED");
                    this.dead = true;
                    this.game.gameState.score+=5;
                    this.playSound('death');
                }
            }
            player.velocity.y = 0;
            player.position.y = this.position.y - player.height.current + 1;
            sideHit = false;
        }
        else if (sideHit && !this.game.player.hitted) {
            this.game.player.hitted = true;
            this.game.gameState.lives--;
            this.game.player.playHitSound();
        }
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

    update() {
        //if enemy is very close to camera

        // should happen everytime
        for (let i = this.bullets.length - 1; i > -1; i--) {
            if (this.bullets[i].update() === 'out') {
                this.bullets.splice(i, 1);
            }
        }
        if (!this.dead && this.isOnCamera(1, 1.5)) {
            this.visible = true;

            this.checkPlayerCollision();

            if (this.lastShot < 0) {
                this.bullets.push(new Bullet(this.game, 'left'));
                this.bullets.push(new Bullet(this.game, 'right'));
                this.bullets.push(new Bullet(this.game, 'top', this.gen.next().value % 3));
                this.lastShot = this.shootInterval;

                this.playSound('shoot');
            }
            this.lastShot--;

        } else {
            if (this.fireworksCountDown > 0) {
                return;
            }
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
        if (this.img) {
            this.game.ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        } else {
            this.game.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            let text = "final enemy: " + this.dead;
            this.game.ctx.fillStyle = "white";
            this.game.ctx.fillText(text, this.position.x + this.width / 2 - this.game.ctx.measureText(text).width / 2,
                this.position.y + this.height / 2);

        }

        if (this.dead && this.fireworksCountDown > 0) {
            let image = new Image();
            image.src = "img/fireworks/" + Math.floor(26 - this.fireworksCountDown / 5) + ".png";
            this.game.ctx.drawImage(image, this.position.x, this.position.y - 250, 150, 150);
            this.fireworksCountDown--;
        }

        this.game.ctx.restore();

        for (let i = this.bullets.length - 1; i > -1; i--) {
            this.bullets[i].render();
        }
    }
}
