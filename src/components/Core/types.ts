export type Cords = [number, number];

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Updatable {
  update(timeElapsed: number): void;
}

export interface GameObject extends Drawable, Updatable {}
