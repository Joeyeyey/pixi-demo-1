import * as PIXI from "pixi.js";
import { App } from "./App";

export abstract class Scene {
    
    container: PIXI.Container<PIXI.DisplayObject>;

    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.create();
        App.app.ticker.add(this.update, this);
    }
    
    abstract create(): void;

    abstract update(dt: number): void;

    abstract destroy(): void;
}
