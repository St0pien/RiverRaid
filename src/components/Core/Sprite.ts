import Level from './Level';
import { Cords, Drawable } from './types';

export class Sprite implements Drawable {
  protected img: HTMLImageElement;
  protected imgOffset: number;
  protected pos: Cords;
  protected size: Cords;

  constructor(img: HTMLImageElement, pos: Cords, size: Cords, offset = 0) {
    this.img = img;
    this.pos = pos;
    this.size = size;
    this.imgOffset = offset;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [x, y] = this.pos;
    const [w, h] = this.size;
    ctx.drawImage(
      this.img,
      0,
      this.imgOffset*100,
      100,
      100,
      Level.hCords(x - w / 2),
      Level.vCords(y - h / 2),
      Level.widthPercent(w),
      Level.widthPercent(h)
    );
  }
}
