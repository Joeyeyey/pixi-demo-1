import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Platform } from './Platform';

export class Hero {

    dy: number;
    maxJumps: number;
    jumpIndex: number;
    score: number;
    sprite: PIXI.Sprite;
    platform: Platform;
    body: Matter.Body;

    constructor() {
        this.createSprite();
        this.createBody();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;
    }

    collectDiamond(diamond): void {
        ++this.score;
        //[13]
        this.sprite.emit("score");
        //[/13]
        diamond.destroy();
    }
    //[/12]

    startJump(): void {
        if (this.platform || this.jumpIndex === 1) {
            ++this.jumpIndex;
            this.platform = null;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
    }

    // [08]
    stayOnPlatform(platform: Platform): void {
        this.platform = platform;
        this.jumpIndex = 0;
    }
    // [/08]

    createBody(): void {
        this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, {friction: 0});
        Matter.World.add(App.physics.world, this.body);
        (this.body as any).gameHero = this;
    }

    update(): void {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;

        // [14]
        if (this.sprite.y > window.innerHeight) {
            this.sprite.emit("die");
        }
        // [/14]
    }

    createSprite(): void {
        this.sprite = new PIXI.AnimatedSprite([
            App.res("walk1"),
            App.res("walk2")
        ]);

        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        (this.sprite as any).loop = true;
        (this.sprite as any).animationSpeed = 0.1;
        (this.sprite as any).play();
    }

    destroy(): void {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        this.sprite.destroy();
    }
}
