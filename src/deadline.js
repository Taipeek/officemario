export default class Deadline {
        
        constructor(game) {
        this.game = game;        
        this.position = {x: 0};
       
        
        this.velocity = {x: 2.0};
       // this.tileWidth = this.game.map.tileWidth;
        //this.tileHeight = this.game.map.tileHeight;
        
       
    }
    
    checkPlayerCollision() {
        let player = this.game.player;
        if (player.position.x<this.position.x){
            this.game.gameState.lives--;
            //player is dead
        }
    }
    
      update() {      

        
        this.checkPlayerCollision();
        this.position.x+=this.velocity.x;

    }
    render() {
         this.game.ctx.save();   
         this.game.ctx.fillStyle = "black";
         this.game.ctx.fillRect(this.position.x-5000,0,5000,10000);
         
          this.game.ctx.restore(); 
                                         }
        
    
        }
