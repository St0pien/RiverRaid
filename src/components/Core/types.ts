import { Sprite } from "./Sprite";

export type Cords = [number, number];

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Updatable {
  update(timeElapsed: number): void;
}

export interface Collidable {
  isColliding(other: Sprite): boolean;
}

export interface GameObject extends Drawable, Updatable {}

export interface Vehicle extends GameObject, Collidable {
  segment: number;
  incrementSegment(): void;
}
