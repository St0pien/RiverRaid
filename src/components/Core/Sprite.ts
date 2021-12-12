import Level from './Level';
import { Cords, Drawable } from './types';

export class Sprite implements Drawable {
  protected img: HTMLImageElement;
  protected imgOffset: number;
  protected pos: Cords;
  protected size: Cords;
  protected frameSize: Cords;

  constructor(
    img: HTMLImageElement,
    pos: Cords,
    size: Cords,
    frameSize: Cords,
    offset = 0
  ) {
    this.img = img;
    this.pos = pos;
    this.size = size;
    this.frameSize = frameSize;
    this.imgOffset = offset;
  }

  get position() {
    return this.pos;
  }

  get width() {
    return this.size[0];
  }

  get height() {
    return this.size[1];
  }

  pureDraw(ctx: CanvasRenderingContext2D) {
    const [x, y] = this.pos;
    const [w, h] = this.size;
    ctx.drawImage(
      this.img,
      0,
      this.imgOffset * this.frameSize[1],
      this.frameSize[0],
      this.frameSize[1],
      x,
      y,
      w,
      h
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [x, y] = this.pos;
    const [w, h] = this.size;
    ctx.drawImage(
      this.img,
      0,
      this.imgOffset * this.frameSize[1],
      this.frameSize[0],
      this.frameSize[1],
      Level.hCords(x - w / 2),
      Level.vCords(y - h / 2),
      Level.heightPercent(w),
      Level.heightPercent(h)
    );
  }
}
