export default class Bug
{
	constructor(game, x, y)
	{
		this.game = game;		
		this.active = true;				
		this.position = {x: x, y: y};
		this.gravity = this.game.player.gravity.current;
		this.tilePos = this.calcTilePosition(this.position);
		this.velocity = {x: 3, y: this.gravity};                
		this.tileWidth = this.game.map.tileWidth;
		this.tileHeight = this.game.map.tileHeight;
                this.falling=false;
              
                
                
	}

	calcTilePosition(position)
	{
		let x = Math.floor( (position.x + this.tileWidth/2) / this.tileWidth);
		let y = Math.floor( (position.y + this.tileHeight/2) / this.tileHeight);
		return {x: x, y: y};
	}

	move()
	{       
                if(!this.falling){
		this.position.x += this.velocity.x;
            }
		this.position.y += this.velocity.y;
		this.tilePos = this.calcTilePosition(this.position);
	}

	checkTileCollisions()
	{
            this.falling=false;
		// check collision with tiles below the lower-left and lower-right corner of the tile
		let belowTilePositionL = {x: Math.floor(this.position.x / this.tileWidth), y: this.tilePos.y +1};
		let belowTileL = this.game.map.tileAt(belowTilePositionL, 0);

		let belowTilePositionR = {x: Math.floor((this.position.x + this.tileWidth) / this.tileWidth), y: this.tilePos.y +1};
		let belowTileR = this.game.map.tileAt(belowTilePositionR, 0);		

                if (belowTileL && !belowTileL.solid&& belowTileR && !belowTileR.solid){
                    this.velocity.y=this.gravity;
                }
                
		else if (belowTileL && belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3)
		{
			this.velocity.y = 0;
            this.position.y = (belowTilePositionL.y -1) * this.tileHeight;
		}
		else if (false && belowTileR && belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3)
		{
			this.velocity.y = 0;
            this.position.y = (belowTilePositionR.y -1) * this.tileHeight;
		}
                
		else{
                    
                }
                 if(belowTileR && !belowTileR.solid && belowTileL && !belowTileL.solid){
                     this.velocity.y=this.gravity;
                    this.falling=true;
        }
                        
		else if (belowTileR && !belowTileR.solid && ((belowTilePositionR.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3)
		{
			this.velocity.x*=-1;
            
		}
                else if (belowTileL && !belowTileL.solid && ((belowTilePositionL.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3)
		{
			this.velocity.x*=-1;
            
		}

		// check collision from the left
		let leftTilePosition = {x: this.tilePos.x -1, y: this.tilePos.y};
		let leftTile = this.game.map.tileAt(leftTilePosition, 0);
		if (leftTile && leftTile.solid && (this.position.x - ((leftTilePosition.x +1) * this.tileWidth)) < 0)
		{
			//console.log("colliding from the left side with " + leftTilePosition.x + " " + leftTilePosition.y);
			this.velocity.x *= -1;
			return;
		}
		let rightTilePosition = {x: this.tilePos.x +1, y: this.tilePos.y};
		let rightTile = this.game.map.tileAt(rightTilePosition, 0);
		if (rightTile && rightTile.solid && ((rightTilePosition.x * this.tileWidth) - (this.position.x + this.tileWidth)) < 0)
		{
			//console.log("colliding from the right side with " + rightTilePosition.x + " " + rightTilePosition.y);
			this.velocity.x *= -1;
			return;
		}
	}

	checkPlayerCollision()
	{
		let player = this.game.player;
		
                let topHit = ((this.position.y <= (player.position.y+ player.height.current)
		 && this.position.y >=( player.position.y + 0.8*player.height.current)
		 && this.position.x >= player.position.x
		 && this.position.x <= (player.position.x+player.width.current)) ||
             ((this.position.y <= (player.position.y+ player.height.current)
		 && this.position.y >=( player.position.y + 0.8*player.height.current)
		 && this.position.x+this.tileWidth >= player.position.x
		 && this.position.x+this.tileWidth <= (player.position.x+player.width.current))));
		
		let leftHit = (this.position.y + this.tileHeight >= player.position.y 
		 && this.position.y <= player.position.y + player.height.current
		 && this.position.x <= player.position.x + player.width.current 
		 && this.position.x >= player.position.x);

		
		let rightHit = (this.position.y + this.tileHeight >= player.position.y 
		 && this.position.y <= player.position.y + player.height.current
		 && this.position.x <= player.position.x
		 && this.position.x + this.tileWidth >= player.position.x);
		
		if (topHit && !this.dead)
		{	//bug killed		
			this.dead = true;
                    
		}
                else if(leftHit || rightHit && !this.dead){
                    //feature picked up
                    this.active = false;
                }
	}



	update()
	{
            
		if (!this.active){
			return;
                    }
                    
		this.checkTileCollisions();
		this.checkPlayerCollision();
		this.move();	
		
	}

	render()
	{
          
		if (!this.active){
			return;
                    }
		this.game.ctx.save();
        this.game.ctx.fillStyle = "green";
        this.game.ctx.fillRect(this.position.x, this.position.y, this.tileWidth, this.tileHeight);
        
        
        this.game.ctx.restore();
	}
}