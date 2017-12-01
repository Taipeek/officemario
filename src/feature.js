export default class Feature {
    constructor(game, x, y) {
        this.game = game;
        this.active = true;
        this.position = {x: x, y: y};
        this.gravity = 0.7;
        this.tilePos = this.calcTilePosition(this.position);
        this.velocity = {x: 3, y: this.gravity};
        this.dead = false;
        this.timeDead = 0;
        this.tileWidth = this.game.map.tileWidth;
        this.tileHeight = this.game.map.tileHeight;
        this.image=new Image();
        this.image.src = "img/feature.png";
        this.falling=false; 


        let b1 = new Image();
        b1.src = "https://s8.postimg.org/l62ilz6bp/image.png";
        let b2 = new Image();
        b2.src = "https://s8.postimg.org/gk6edn085/image.png";
        let b3 = new Image();
        b3.src = "https://s8.postimg.org/uqm58w5yd/image.png";
        let b4 = new Image();
        b4.src = "https://s8.postimg.org/k529wc21h/image.png";
        let b5 = new Image();
        b5.src = "https://s8.postimg.org/4wcciknsl/image.png";
        let b6 = new Image();
        b6.src = "https://s8.postimg.org/mz5f9srd1/image.png";
        let b7 = new Image();
        b7.src = "https://s8.postimg.org/fj65o0qt1/image.png";
        let b8 = new Image();
        b8.src = "https://s8.postimg.org/tcuid2ytx/image.png";
        let b9 = new Image();
        b9.src = "https://s8.postimg.org/etndbol4l/image.png";
        let b10 = new Image();
        b10.src = "https://s8.postimg.org/4wccin0o5/image.png";
        let b11 = new Image();
        b11.src = "https://s8.postimg.org/u2daph9o5/image.png";
        let b12 = new Image();
        b12.src = "https://s8.postimg.org/w6xnqkqqd/image.png";
        let b13 = new Image();
        b13.src = "https://s8.postimg.org/5d25iz651/image.png";

        this.blood = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13];
    }

    calcTilePosition(position) {
        let x = Math.floor((position.x + this.tileWidth / 2) / this.tileWidth);
        let y = Math.floor((position.y + this.tileHeight / 2) / this.tileHeight);
        return {x: x, y: y};
    }

    move() {
        if(!this.falling){
        this.position.x += this.velocity.x;
     }
        this.position.y += this.velocity.y;
        this.tilePos = this.calcTilePosition(this.position);
    }

    checkTileCollisions() {
        this.falling=false;
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
        else if (false && belowTileR && belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.y = 0;
            this.position.y = (belowTilePositionR.y - 1) * this.tileHeight;
        }

        else {

        }
        if(belowTileR && !belowTileR.solid && belowTileL && !belowTileL.solid){
          this.velocity.y=this.gravity;
          this.falling=true;
        }

        else if (belowTileR && !belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.x *= -1;

        }
        else if (belowTileL && !belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3) {
            this.velocity.x *= -1;

        }
        else{
            this.velocity.y=this.gravity;
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
                && this.position.x + this.tileWidth <= (player.position.x + player.width.current))));

        let leftHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x + player.width.current
            && this.position.x >= player.position.x);


        let rightHit = (this.position.y + this.tileHeight >= player.position.y
            && this.position.y <= player.position.y + player.height.current
            && this.position.x <= player.position.x
            && this.position.x + this.tileWidth >= player.position.x);

        if (topHit && !this.dead) {	//feature killed
            this.dead = true;

        }
        else if (leftHit || rightHit && !this.dead) {
            //feature picked up
            this.active = false;
        }
    }


    update() {
        if (this.dead) {
            this.timeDead++;
        }
        if (!this.active || this.dead)
            return;
        this.checkTileCollisions();
        this.checkPlayerCollision();
        this.move();

    }

    render() {
        if (this.dead) {


            this.game.ctx.save();
            this.game.ctx.translate(this.position.x - this.tileWidth * 1.65, this.position.y + this.tileHeight * 0.6);
            this.game.ctx.rotate(Math.PI);
            this.game.ctx.drawImage(this.blood[Math.min(Math.floor(this.timeDead / 1.6), 12)], -this.tileWidth * 3.9, -this.tileHeight * 0.95, this.tileWidth * 3, this.tileHeight);
            
            this.game.ctx.restore();
            if(this.timeDead<125){
            this.game.ctx.save();
            this.game.ctx.fillStyle = "red";
            this.game.ctx.font = "20px Comic Sans MS";
            this.game.ctx.fillText("Oh no! You killed this innocent feature!", this.position.x-150, this.position.y-100);
            this.game.ctx.restore();
        }
            //this.game.ctx.drawImage(this.blood[Math.min(Math.floor(this.timeDead/2),12)],this.position.x-this.tileWidth*0.9,this.position.y+this.tileHeight*0.6, this.tileWidth*3, this.tileHeight);


            return;
        }
        if (!this.active){
            return;
        }
        this.game.ctx.save();
        this.game.ctx.fillStyle = "blue";
        this.game.ctx.fillRect(this.position.x, this.position.y, this.tileWidth, this.tileHeight);
        this.game.ctx.drawImage(this.image, this.position.x, this.position.y, this.tileWidth, this.tileHeight);
        
        this.game.ctx.restore();
    }
}