export default class ScoreBoard {
    constructor(game) {
        this.x = 0;
        this.y = 0;
        this.height = 20;
        this.game = game;
        this.width = game.canvas.width;
        this.render = this.render.bind(this);
        this.renderGameOver = this.renderGameOver.bind(this);
        this.renderPause = this.renderPause.bind(this);
        this.renderFirstGame = this.renderFirstGame.bind(this);
        this.mute = new Image();
        this.mute.src = 'img/mute-icon.png';
    }

    render() {
        let gameState = this.game.gameState;
        this.game.ctx.save();
        //this.game.ctx.lineWidth = 1;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.font = '18px sans-serif';
        this.game.ctx.fontStyle = 'bold';
        this.game.ctx.fillText("Scores: " + gameState.score, this.x + 10, this.y + 20);
        this.game.ctx.fillText("Lives: " + gameState.lives, this.x + 100, this.y + 20);
        this.game.ctx.fillText("Level: " + gameState.level, this.x + 190, this.y + 20);

        if (this.game.maxVolume === 0) {
            try {
                this.game.ctx.drawImage(this.mute, this.x + 275, this.y + 5, 18, 18);
            }
            catch(e) {
                this.game.ctx.fillText("Muted", this.x + 275, this.y + 20);
            }
        }
        this.game.ctx.restore();
    }

    renderFirstGame() {
        if (this.game.gameState.status !== "new") return;
        let y = this.game.canvas.height;
        this.game.ctx.save();
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.globalAlpha = 0.6;
        this.game.ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.ctx.globalAlpha = 1;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fontStyle = 'bold';
        this.game.ctx.fillText("Welcome to Office Mario!", this.x + 1 / 10 * this.width, y-300);
        this.game.ctx.font = '25px sans-serif';
        this.game.ctx.fillText("Use arrow keys to move and jump", this.x + 1 / 10 * this.width, y - 250);
        this.game.ctx.fillText("Beware of the bugs and get all the features!", this.x + 1 / 10 * this.width, y - 200);
        this.game.ctx.fillText("Press p to pause the game", this.x + 1 / 10 * this.width, y - 150);
        this.game.ctx.fillText("Press m to mute all sounds", this.x + 1 / 10 * this.width, y - 100);
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fillText("Press space to start the game", this.x + 1 / 10 * this.width, y - 50);
        this.game.ctx.restore();
    }

    renderGameOver() {
        if (this.game.gameState.status !== "over") return;
        let y = this.game.canvas.height;
        this.game.ctx.save();
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.globalAlpha = 0.6;
        this.game.ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.ctx.globalAlpha = 1;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fontStyle = 'bold';
        this.game.ctx.fillText("Game Over!", this.x + 1 / 10 * this.width, y-300);
        this.game.ctx.font = '25px sans-serif';
        this.game.ctx.fillText("Score: " + this.game.gameState.score, this.x + 1 / 10 * this.width, y - 250);
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fillText("Press space to start new game", this.x + 1 / 10 * this.width, y - 100);
        this.game.ctx.restore();

    }

    renderPause() {
        if (this.game.gameState.status !== "paused") return;
        let y = this.game.canvas.height;
        this.game.ctx.save();
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.globalAlpha = 0.6;
        this.game.ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.ctx.globalAlpha = 1;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fontStyle = 'bold';
        this.game.ctx.fillText("Paused", this.x + 1 / 10 * this.width, y-300);
        this.game.ctx.font = '25px sans-serif';
        this.game.ctx.fillText("Use arrow keys to move and jump", this.x + 1 / 10 * this.width, y - 250);
        this.game.ctx.fillText("Beware of the bugs and get all the features!", this.x + 1 / 10 * this.width, y - 200);
        this.game.ctx.fillText("Press p to pause the game", this.x + 1 / 10 * this.width, y - 150);
        this.game.ctx.font = '40px sans-serif';
        this.game.ctx.fillText("Press space to resume the game", this.x + 1 / 10 * this.width, y - 100);
        this.game.ctx.restore();
    }
}
