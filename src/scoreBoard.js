export default class ScoreBoard {
    constructor(game) {
        this.x = 0;
        this.y = 0;
        //this.width = width;
        this.height = 20;
        this.game = game;
        this.render = this.render.bind(this);
        this.renderGameOver = this.renderGameOver.bind(this);
        this.renderPause = this.renderPause.bind(this);
        this.renderFirstGame = this.renderFirstGame.bind(this);
    }

    render() {
        let gameState = this.game.gameState;
        this.game.ctx.save();
        this.game.ctx.lineWidth = 1;
        this.game.ctx.fillStyle = "white";
        this.game.ctx.font = '18px sans-serif';
        this.game.ctx.fontStyle = 'bold';
        this.game.ctx.fillText("Score: " + gameState.score, this.x, this.y + 20);
        this.game.ctx.fillText("Lives: " + gameState.lives, this.x + 50, this.y + 20);
        this.game.ctx.restore();
    }

    renderFirstGame(ctx, gameState) {
        if (gameState.status !== "new") return;
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Welcome to asteroids", this.x + 1 / 10 * this.width, this.y - 500);
        ctx.font = '25px sans-serif';
        ctx.fillText("Use left/right arrow to steer and up arrow to generate thrust", this.x + 1 / 10 * this.width, this.y - 450);
        ctx.fillText("Use 'x' key to warp your ship to random place", this.x + 1 / 10 * this.width, this.y - 420);
        ctx.fillText("Press 'p' key to pause the game", this.x + 1 / 10 * this.width, this.y - 390);
        ctx.font = '40px sans-serif';
        ctx.fillText("Press space to start the game", this.x + 1 / 10 * this.width, this.y - 340);
        ctx.restore();
    }

    renderGameOver(ctx, gameState) {
        if (gameState.status !== "over") return;
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Game Over!", this.x + 1 / 10 * this.width, this.y - 500);
        ctx.fillText("Score: " + gameState.score, this.x + 1 / 10 * this.width, this.y - 450);
        ctx.font = '25px sans-serif';
        ctx.fillText("Use left/right arrow to steer and up arrow to generate thrust", this.x + 1 / 10 * this.width, this.y - 400);
        ctx.fillText("Use 'x' key to warp your ship to random place", this.x + 1 / 10 * this.width, this.y - 370);
        ctx.fillText("Press 'p' key to pause the game", this.x + 1 / 10 * this.width, this.y - 340);
        ctx.font = '40px sans-serif';
        ctx.fillText("Press space to start new game", this.x + 1 / 10 * this.width, this.y - 290);
        ctx.restore();
    }

    renderPause(ctx, gameState) {
        if (gameState.status !== "paused") return;
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "brgba(0, 0, 0, 0.76)";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Paused", this.x + 1 / 10 * this.width, this.y - 500);
        ctx.font = '25px sans-serif';
        ctx.fillText("Use left/right arrow to steer and up arrow to generate thrust", this.x + 1 / 10 * this.width, this.y - 450);
        ctx.fillText("Use 'x' key to warp your ship to random place", this.x + 1 / 10 * this.width, this.y - 420);
        ctx.fillText("Press 'p' key to pause the game", this.x + 1 / 10 * this.width, this.y - 390);
        ctx.font = '40px sans-serif';
        ctx.fillText("Press space to resume the game", this.x + 1 / 10 * this.width, this.y - 340);
        ctx.restore();
    }
}
