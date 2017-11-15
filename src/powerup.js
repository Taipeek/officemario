export default class Powerup
{
	constructor(game, x, y, type)
	{
		this.game = game;
		this.type = type;
		this.active = true;
		this.timeToLive = Math.floor((5 + Math.random() * 5) * this.game.gameLoopSpeed); // 5 to 10 seconds		
		this.position = {x: x, y: y};
		this.gravity = this.game.player.gravity.current;
		this.tilePos = this.calcTilePosition(this.position);
		this.velocity = {x: (Math.random()<0.5 ? -1 : 1),
						 y: this.gravity};
		this.tileWidth = this.game.map.tileWidth;
		this.tileHeight = this.game.map.tileHeight;
	}

	calcTilePosition(position)
	{
		let x = Math.floor( (position.x + this.tileWidth/2) / this.tileWidth);
		let y = Math.floor( (position.y + this.tileHeight/2) / this.tileHeight);
		return {x: x, y: y};
	}

	move()
	{
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.tilePos = this.calcTilePosition(this.position);
	}

	checkTileCollisions()
	{
		// check collision with a below tile
		let belowTilePosition = {x: this.tilePos.x, y: this.tilePos.y +1};
		let belowTile = this.game.map.tileAt(belowTilePosition, 0);

		if (belowTile && belowTile.solid && ((belowTilePosition.y * this.tileHeight) - this.position.y - this.tileHeight) <= 3)
		{
			//console.log("colliding from the bottom with " + belowTilePosition.x + " " + belowTilePosition.y);
			this.velocity.y = 0;
            this.position.y = (belowTilePosition.y -1) * this.tileHeight;
		}
		else
			this.velocity.y += this.gravity;

		// needs fixing - tile clips into the wall
		// check collision from the left
		let leftTilePosition = {x: this.tilePos.x -1, y: this.tilePos.y};
		let leftTile = this.game.map.tileAt(leftTilePosition, 0);
		if (leftTile && leftTile.solid && (this.position.x - ((leftTilePosition.x +1) * this.tileWidth)) <= 0)
		{
			//console.log("colliding from the left side with " + leftTilePosition.x + " " + leftTilePosition.y);
			this.velocity.x *= -1;
			return;
		}
		let rightTilePosition = {x: this.tilePos.x +1, y: this.tilePos.y};
		let rightTile = this.game.map.tileAt(rightTilePosition, 0);
		if (rightTile && rightTile.solid && ((rightTilePosition.x * this.tileWidth) - (this.position.x + this.tileWidth)) <= 0)
		{
			//console.log("colliding from the right side with " + rightTilePosition.x + " " + rightTilePosition.y);
			this.velocity.x *= -1;
			return;
		}
	}

	checkPlayerCollision()
	{
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
		
		if (leftHit || rightHit)
		{
			this.apply();
			this.active = false;
		}
	}

	apply()
	{
		switch(this.type)
		{
			case 'debug':
				//this.player.onehitBugs = true;
				break;
			case 'auto':
				this.game.player.maxVelocity.x *= 2;
				this.game.player.maxVelocity.y *= 2;
				break;
			default:
				console.log("unknown powerup type: " + this.type);
				return;
		}
	}

	update()
	{
		if (!this.active)
			return;
		this.checkTileCollisions();
		this.checkPlayerCollision();
		this.move();

		this.timeToLive -= 1;
		if (this.timeToLive <= 0)
			this.active = false;
	}

	render()
	{
		if (!this.active)
			return;
		this.game.ctx.save();
        this.game.ctx.fillStyle = "red";
        this.game.ctx.fillRect(this.position.x, this.position.y, this.tileWidth, this.tileHeight);
        let text = this.type;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.fillText(this.type, this.position.x + this.tileWidth/2 - this.game.ctx.measureText(text).width/2, 
        					   this.position.y + this.tileHeight/2);
        this.game.ctx.restore();
	}
}