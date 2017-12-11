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
        this.image = new Image();
        this.image.src = "img/feature.png";
        this.falling = false;
        this.texts=["print('Hello, World')", "System.out.println('Hello, World')", "DISPLAY 'Hello, world!'."," cout << 'Hello, World!' << endl;","alert( 'Hello, world!' );"," Console.WriteLine('Hello, world!');","main = putStrLn 'Hello, world!'","(format t 'Hello, world!~%')","io.write('Hello, world!\n')","disp('Hello, world!'):","echo Hello, world!"];
        this.text=this.texts[Math.floor(Math.random()*this.texts.length)];
        this.timePicked=0;
        this.picked=false;
        this.star=new Image();
        this.star.src = "img/star.png";
        let b1 = new Image();
        b1.src = "img/blood/3.png";
        let b2 = new Image();
        b2.src = "img/blood/4.png";
        let b3 = new Image();
        b3.src = "img/blood/5.png";
        let b4 = new Image();
        b4.src = "img/blood/6.png";
        let b5 = new Image();
        b5.src = "img/blood/7.png";
        let b6 = new Image();
        b6.src = "img/blood/8.png";
        let b7 = new Image();
        b7.src = "img/blood/9.png";
        let b8 = new Image();
        b8.src = "img/blood/10.png";
        let b9 = new Image();
        b9.src = "img/blood/11.png";
        let b10 = new Image();
        b10.src = "img/blood/12.png";
        let b11 = new Image();
        b11.src = "img/blood/13.png";
        let b12 = new Image();
        b12.src = "img/blood/14.png";
        let b13 = new Image();
        b13.src = "img/blood/15.png";
        
        this.blood = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13];
        this.timeBounced=999;
        this.prepareSounds();
    }

    prepareSounds()
    {
        this.sounds = {
            pickup: new Audio('sounds/feature.wav'),
            death: new Audio('sounds/splat.wav')
        };
        this.sounds.pickup.load();
        this.sounds.death.load();
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
        this.timeBounced++;
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
        else {
            this.velocity.y = this.gravity;
        }

        // check collision from the left
        let leftTilePosition = {x: this.tilePos.x - 1, y: this.tilePos.y};
        let leftTile = this.game.map.tileAt(leftTilePosition, 0);
        if (this.timeBounced>50 && leftTile && leftTile.solid && (this.position.x - ((leftTilePosition.x + 1) * this.tileWidth)) < 0) {
            //console.log("colliding from the left side with " + leftTilePosition.x + " " + leftTilePosition.y);
            this.velocity.x *= -1;
            this.timeBounced=0;
            return;
        }
        let rightTilePosition = {x: this.tilePos.x + 1, y: this.tilePos.y};
        let rightTile = this.game.map.tileAt(rightTilePosition, 0);
        if (this.timeBounced>50 && rightTile && rightTile.solid && ((rightTilePosition.x * this.tileWidth) - (this.position.x + this.tileWidth)) < 0) {
            //console.log("colliding from the right side with " + rightTilePosition.x + " " + rightTilePosition.y);
            this.velocity.x *= -1;
            this.timeBounced=0;
            return;
        }
    }

    checkPlayerCollision() {
        let player = this.game.player;

        let topHit = (            
            player.velocity.y > 0
            //left point
            &&((player.position.x < this.position.x
            &&player.position.x + player.width.current > this.position.x
            &&player.position.y + player.height.current > this.position.y-this.tileHeight*0.5
            &&player.position.y + player.height.current*0.65 < this.position.y-this.tileHeight*0.5
            )
            //right point
            ||(player.position.x < this.position.x+this.tileWidth
            &&player.position.x + player.width.current > this.position.x+this.tileWidth
            &&player.position.y + player.height.current > this.position.y-this.tileHeight*0.5
            &&player.position.y + player.height.current*0.65 < this.position.y-this.tileHeight*0.5)) 
        );
    
        let sideHit = (
            (player.position.x < this.position.x
            &&player.position.x + player.width.current > this.position.x
            &&player.position.y + player.height.current > this.position.y
            &&player.position.y < this.position.y
            )||(player.position.x < this.position.x+this.tileWidth
            &&player.position.x + player.width.current > this.position.x+this.tileWidth
            &&player.position.y + player.height.current > this.position.y
            &&player.position.y< this.position.y)
        );

        if (topHit && !this.dead) {	//feature killed
            this.dead = true;
            this.sounds.death.volume = this.game.maxVolume / 2;
            this.sounds.death.play();
        }
        else if (sideHit && !this.dead) {
            //feature picked up
            this.active = false;
            this.picked = true;
            this.game.gameState.score += 1;
            this.sounds.pickup.volume = this.game.maxVolume / 3;
            this.sounds.pickup.play();
        }
    }


    update() {
        if(this.picked){
            this.timePicked++;
        }
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
            //this.game.ctx.drawImage(this.blood[Math.min(Math.floor(this.timeDead/2),12)],this.position.x-this.tileWidth*0.9,this.position.y+this.tileHeight*0.6, this.tileWidth*3, this.tileHeight);


            return;
        }
        else if(this.picked){
            this.game.ctx.save();
            this.game.ctx.fillStyle = "blue";
            this.game.ctx.font = "15px Consolas";
            if((this.timePicked<50 && this.timePicked%10>5) || this.timePicked>200|| (this.timePicked>180 &&this.timePicked%10<5)){
                 this.game.ctx.restore();
                return;
            }
            var starsDelta=5;
            if(this.timePicked>110+starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*0.4, this.position.y-150,28,28);
            }
            if(this.timePicked>110+2*starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*3.6, this.position.y-86,28,28);
            }
            if(this.timePicked>110+3*starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*6.4, this.position.y-155,28,28);
            }
            if(this.timePicked>110+4*starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*0.6, this.position.y-95,28,28);
            }
            if(this.timePicked>110+5*starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*3.4, this.position.y-150,28,28);
            }
            if(this.timePicked>110+6*starsDelta){
              this.game.ctx.drawImage(this.star, this.position.x+this.text.length*6.6, this.position.y-90,28,28);
            }

            this.game.ctx.fillText(this.text,this.position.x,this.position.y-Math.min(this.timePicked,100));
            this.game.ctx.restore();
        }
        if (!this.active) {
            return;
        }
        this.game.ctx.save();
        this.game.ctx.drawImage(this.image, this.position.x, this.position.y-0.5*this.tileHeight, this.tileWidth, this.tileHeight*1.5);

        this.game.ctx.restore();
    }
}
