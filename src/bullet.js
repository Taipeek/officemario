export default class Bullet {
    constructor (x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: 3,
            y: 0
        };
    }

    update(){

    }

    render(ctx){
        ctx.save();



        ctx.restore();
    }
}