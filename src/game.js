import Player from "./player";
import LevelMap from "./levelMap";
import Powerup from "./powerup";
import Feature from "./feature";
import FinalEnemy from"./finalEnemy"
import ScoreBoard from "./scoreBoard";
import Bug from "./bug";

export default class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 480;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.gameState = {};
        this.framerate = 60;
        this.gameLoopSpeed = 1000 / this.framerate;
        this.keyBoard = [];
        this.screenPosition = {x: 0, y: 0};

        //binds
        this.moveScreen = this.moveScreen.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.newGame = this.newGame.bind(this);
        this.checkGameOver = this.checkGameOver.bind(this);
        this.pause = this.pause.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.renderCounter = 0;
        this.shake = {on: false};

        // key handlers
        window.onkeydown = this.handleKeyDown;
        window.onkeyup = this.handleKeyUp;
        this.newGame();
    }

    moveScreen(where, step) {
        if (!step) step = 8;
        if (where === "right") {
            this.screenPosition.x += step;
            if (this.screenPosition.x + this.canvas.width > this.map.mapWidthPixels) this.screenPosition.x = this.map.mapWidthPixels - this.canvas.width;
        } else if (where === "left") {
            this.screenPosition.x -= step;
            if (this.screenPosition.x < 0) this.screenPosition.x = 0;
        } else if (where === "up") {
            this.screenPosition.y -= step;
            if (this.screenPosition.y < 0) this.screenPosition.y = 0;

        } else if (where === "down") {
            this.screenPosition.y += step;
            if (this.screenPosition.y + this.canvas.height > this.map.mapHeightPixels) this.screenPosition.y = this.map.mapHeightPixels - this.canvas.height;
        }
    }

    newGame() {
        this.gameState = {
            status: "new",
            score: 0,
            lives: 1,
            level: 1
        };
        this.screenPosition = {x: 0, y: 0};
        //Create game objects
        this.map = new LevelMap(this);
        this.player = new Player(this);
        this.scoreBoard = new ScoreBoard(this);
        this.gameLoopInterval = null;
        this.powerups = [];
        this.features = [];
        this.finalEnemy = new FinalEnemy(this.gameState.level, 33, 31);
        let objectLayer = this.map.mapData.layers[2];
        objectLayer.objects.forEach(item => {
            if (item.type === "playerspawn") {
                this.player.position.x = item.x;
                this.player.position.y = item.y;
            } else if (item.type === "powerupspawn") {
                this.powerups.push(new Powerup(this, item.x, item.y, 'coffee'));
            } else if (item.type === "enemyspawn") {
                this.features.push(new Bug(this, item.x, item.y));
            }else if (item.type === "featurespawn") {
                this.features.push(new Feature(this, item.x, item.y));
            }
        });
        window.onload = () => {
            this.render();
            this.scoreBoard.renderFirstGame();
        }
    }

    checkGameOver() {
        if (this.gameState.lives === 0) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.gameState.status = "over";
            console.log(this);
            this.render();
            this.scoreBoard.renderGameOver();
        }
    }

    pause() {
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.gameState.status = "paused";
        console.log(this);
        this.render();
        this.scoreBoard.renderPause();
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (this.gameState.status !== "running") {
            switch (event.key) {
                case ' ':
                    if (this.gameState.status === "over") {
                        this.newGame();
                    }
                    this.gameLoopInterval = setInterval(this.gameLoop, this.gameLoopSpeed);
                    this.gameState.status = "running";
                    break;
            }
            return;
        }
        if (event.key === "p") {
            this.pause();
            return;
        }
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.keyBoard["up"] = true;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keyBoard["left"] = true;
                break;
            case 'd':
            case 'ArrowRight':
                this.keyBoard["right"] = true;
                break;
            case 's':
            case 'ArrowDown':
                this.keyBoard["down"] = true;
                break;
        }

        if (event.key === "v") {
            let xy = this.player.getTileXY();
            console.log(xy, this.map.tileAt(xy.x, xy.y, 0))
        }
    }

    handleKeyUp(event) {
        event.preventDefault();
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.keyBoard["up"] = false;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keyBoard["left"] = false;
                break;
            case 'd':
            case 'ArrowRight':
                this.keyBoard["right"] = false;
                break;
            case 's':
            case 'ArrowDown':
                this.keyBoard["down"] = false;
                break;
        }
    }

    handleShake() {
        if (!this.shake.on)
            return;

        let randX = (0.5 - Math.random()) * 30; // almost unplayable
        let randY = (0.5 - Math.random()) * 18;

        if (this.shake.rampdown) {
            randX *= (this.shake.counter / (this.framerate*2));
            randY *= (this.shake.counter / (this.framerate*2));
        }
        this.ctx.translate(Math.floor(randX), Math.floor(randY));
        this.shake.counter--;

        if (this.shake.counter <= 2* this.framerate)
            this.shake.rampdown = true;
    }

    render() {
        this.ctx.save();
        this.handleShake();
        this.ctx.translate(-this.screenPosition.x, -this.screenPosition.y);
        this.map.render();

        this.player.render();
        this.powerups.forEach(powerup => {
            powerup.render();
        });
        this.features.forEach(feature => {
            feature.render();
        });
        this.ctx.restore();
        this.scoreBoard.render();
        this.renderCounter++;
    }

    update() {
        this.map.update();
        this.player.update();
        this.powerups.forEach(powerup => {
            powerup.update();
        });
        this.features.forEach(feature => {
            feature.update();
        });
        this.finalEnemy.update();
    }

    gameLoop() {
        this.update();
        this.render();
        this.checkGameOver();
    }
}
