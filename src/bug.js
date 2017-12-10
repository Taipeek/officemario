export default class Bug {
    constructor(game, x, y) {
        this.game = game;
        this.position = {x: x, y: y};
        this.gravity = this.game.player.gravity.current;
        this.tilePos = this.calcTilePosition(this.position);
        this.velocity = {x: 3, y: this.gravity};
        this.tileWidth = this.game.map.tileWidth;
        this.tileHeight = this.game.map.tileHeight;
        this.falling = false;
        this.imageWalk = new Image();
        this.imageWalk.src = "img/bug.png";
        this.imageDead = new Image();
        this.imageDead.src = "img/bugBlood.png";
        this.dead=false;
        var texts=["NullPointerException","Array index out of bounds","Error: Division by zero","EOFError: EOF when reading a line","SyntaxError: invalid syntax","TypeError: Failed to execute 'main'","HTMLImageElement is in 'broken' state"]
        this.text=texts[Math.floor(Math.random()*texts.length)];
        this.timeDead=0;

        this.poof0 = new Image();
        this.poof0.src = "img/poof/0.png";
        this.poof1 = new Image();
        this.poof1.src = "img/poof/1.png";
        this.poof2 = new Image();
        this.poof2.src = "img/poof/2.png";
        this.poof3 = new Image();
        this.poof3.src = "img/poof/3.png";
        this.poof4 = new Image();
        this.poof4.src = "img/poof/4.png";
        this.poof5 = new Image();
        this.poof5.src = "img/poof/5.png";
        this.poof6 = new Image();
        this.poof6.src = "img/poof/6.png";
        this.poof7 = new Image();
        this.poof7.src = "img/poof/7.png";
        this.poof8 = new Image();
        this.poof8.src = "img/poof/8.png";
        this.poof9 = new Image();
        this.poof9.src = "img/poof/9.png";
        this.poof10 = new Image();
        this.poof10.src = "img/poof/10.png";
        this.poof11 = new Image();
        this.poof11.src = "img/poof/11.png";
        this.poof12 = new Image();
        this.poof12.src = "img/poof/12.png";
        this.poof13 = new Image();
        this.poof13.src = "img/poof/13.png";
        this.poof14 = new Image();
        this.poof14.src = "img/poof/14.png";
        this.poof=[this.poof0,this.poof1,this.poof2,this.poof3,this.poof4,this.poof5,this.poof6,this.poof7,this.poof8,this.poof9,this.poof10,this.poof11,this.poof12,this.poof13,this.poof14];
    	this.sound = new Audio('sounds/splat.wav');
    	this.sound.load();
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.tileWidth / 2) / this.tileWidth);
        let y = Math.floor((position.y + this.tileHeight / 2) / this.tileHeight);
        return {x: x, y: y};
    }

    move() {
        if (!this.falling) {
            this.position.x += this.velocity.x;
        }
        this.position.y += this.velocity.y;
        this.tilePos = this.calcTilePosition(this.position);
    }

    checkTileCollisions() {
        this.falling = false;
        // check collision with tiles below the lower-left and lower-right corner of the tile
        let belowTilePositionL = {x: Math.floor(this.position.x / this.tileWidth), y: this.tilePos.y + 1};
        let belowTileL = this.game.map.tileAt(belowTilePositionL, 0);

        let belowTilePositionR = {
            x: Math.floor((this.position.x + this.tileWidth) / this.tileWidth),
            y: this.tilePos.y + 1
        };
        let belowTileR = this.game.map.tileAt(belowTilePositionR, 0);

        if (belowTileL && !belowTileL.solid && belowTileR && !belowTileR.solid) {
            this.velocity.y = this.gravity;
        }

        else if (belowTileL && belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.y = 0;
            this.position.y = (belowTilePositionL.y - 1) * this.tileHeight;
        }
        else if (false && belowTileR && belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.y = 0;
            this.position.y = (belowTilePositionR.y - 1) * this.tileHeight;
        }

        else {

        }
        if (belowTileR && !belowTileR.solid && belowTileL && !belowTileL.solid) {
            this.velocity.y = this.gravity;
            this.falling = true;
        }

        else if (belowTileR && !belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.x *= -1;

        }
        else if (belowTileL && !belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.x *= -1;

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

        let topHit = ((this.position.y <= (player.position.y + player.height.current)
            && this.position.y >= ( player.position.y + 0.8 * player.height.current)
            && this.position.x >= player.position.x
            && this.position.x <= (player.position.x + player.width.current)) ||
            ((this.position.y <= (player.position.y + player.height.current)
                && this.position.y >= ( player.position.y + 0.8 * player.height.current)
                && this.position.x + this.tileWidth >= player.position.x
                && player.velocity.y>0
                && this.position.x + this.tileWidth <= (player.position.x + player.width.current))));

        let leftHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x + player.width.current
            && this.position.x >= player.position.x);


        let rightHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x
            && this.position.x + this.tileWidth >= player.position.x);

        if (topHit && !this.dead) {	//bug killed
            this.dead = true;
            this.sound.volume = this.game.maxVolume / 2;
            this.sound.play();
        }
        else if ((leftHit || rightHit) && !this.dead && !this.game.player.hitted) {
            this.game.player.hitted=true;
            this.game.gameState.lives--;
            this.game.player.playHitSound();
        }
    }

//
    update() {

        if (this.dead) {
            this.timeDead++;
            return;
        }

        this.checkTileCollisions();
        this.checkPlayerCollision();
        this.move();

    }

    render() {
        if (this.dead){
           this.game.ctx.save();

        this.game.ctx.drawImage(this.imageDead, this.position.x, this.position.y+this.tileHeight*0.85, this.tileWidth, this.tileHeight);
        this.game.ctx.fillStyle = "red";
        this.game.ctx.font = "15px Consolas";
        if(this.timeDead<55){
         this.game.ctx.fillStyle = "red";
         this.game.ctx.fillText(this.text, this.position.x, this.position.y-this.timeDead);
        }
        else if(this.timeDead>55 && this.timeDead<100){
             if(this.timeDead%10>5){
                  this.game.ctx.fillStyle = "green";
             }
             else{
                  this.game.ctx.fillStyle = "red";
             }
             this.game.ctx.fillText(this.text, this.position.x, this.position.y-this.timeDead);
        }
        else if(this.timeDead<130){
            this.game.ctx.fillStyle = "green";
             this.game.ctx.fillText(this.text, this.position.x, this.position.y-this.timeDead);
        }
         else if(this.timeDead<190){
            this.game.ctx.fillStyle = "green";
             this.game.ctx.fillText(this.text, this.position.x, this.position.y-130);
        }
        var timeStepPoof=5;
        if(this.timeDead>160 && this.timeDead<160+14*timeStepPoof ){

                this.game.ctx.drawImage(this.poof[Math.floor((this.timeDead-160)/timeStepPoof)], this.position.x+40, this.position.y-130-75, 150,150);
        }



        this.game.ctx.restore();


        return;
        }


        this.game.ctx.save();

        this.game.ctx.drawImage(this.imageWalk, this.position.x, this.position.y, this.tileWidth, this.tileHeight);

        this.game.ctx.restore();
    }
}