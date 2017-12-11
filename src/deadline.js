export default class Deadline {
        
        constructor(game) {
        this.game = game;        
        this.position = {x: -1000};
        this.tick1=new Audio('sounds/tick1.mp3')
        this.tick2=new Audio('sounds/tick2.mp3')
        
        this.velocity = {x: 2.0};
       // this.tileWidth = this.game.map.tileWidth;
        //this.tileHeight = this.game.map.tileHeight;
        this.soundPlaying=false;
       
    }
    
    checkPlayerCollision() {
        let player = this.game.player;
        if (player.position.x<this.position.x){
            this.game.gameState.lives--;
            //player is dead
        }
    }
    
      update() {
        let player = this.game.player;
        if(!this.soundPlaying){
            this.soundPlaying=true;
            this.tick1.play();
            this.tick2.play();
        }
        if(this.tick1.paused){
            this.tick1.play();
        }
        if(this.tick2.paused){
            this.tick2.play();
        }
        this.tick1.volume = this.game.maxVolume*(1-Math.max(0,Math.min(1,(player.position.x-this.position.x)/1000)));
        this.tick2.volume = this.game.maxVolume*(1-Math.max(0,Math.min(1,(player.position.x-this.position.x)/1000)));
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
