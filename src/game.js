import Player from "./player";
import LevelMap from "./levelMap";
import Powerup from "./powerup";
import Feature from "./feature";

export default class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 480;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.gameState = {};
        this.gameLoopSpeed = 100 / 3;
        this.keyBoard = [];
        this.screenPosition = {x: 0, y: 0};

        //binds
        this.moveScreen = this.moveScreen.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.newGame = this.newGame.bind(this);
        this.pause = this.pause.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.renderCounter = 0;
        this.shake = false;

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
            lives: 3,
            level: 1,
        };
        //Create game objects
        this.map = new LevelMap(this);
        this.player = new Player(this);
        this.gameLoopInterval = null;
        this.powerups = [];
        this.features = [];
        let objectLayer = this.map.mapData.layers[3];
        objectLayer.objects.forEach(item => {
            if (item.type === "playerspawn") {
                this.player.position.x = item.x;
                this.player.position.y = item.y;
            } else if (item.type === "powerupspawn") {
                this.powerups.push(new Powerup(this, item.x, item.y, 'auto'));
            } else if (item.type === "enemyspawn") {
                this.features.push(new Feature(this, item.x, item.y));
            }
        });

    }

    pause() {
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.gameState.status = "paused";
        console.log(this);
        this.render();
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (this.gameState.status !== "running") {
            switch (event.key) {
                case ' ':
                    if (this.gameState.status === "over") {
                        this.newGame();
                        return;
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

    shakeScreen()
    {
        let randX = Math.floor((0.5 - Math.random()) * 20);
        let randY = Math.floor((0.5 - Math.random()) * 12);
        this.ctx.translate(randX,randY);
    }

    render() {        
        this.ctx.save();
        if (this.shake)
            this.shakeScreen();
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
    }

    gameLoop() {
        this.update();
        this.render();
    }
}