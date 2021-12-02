import Level from '../Core/Level';
import { Colors } from '../Core/Resources';
import { Drawable } from '../Core/types';

class Bridge implements Drawable {
  y: number;
  height: number;

  constructor(y: number, height: number) {
    this.y = y;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Colors.street1;
    ctx.fillRect(0, this.y, Level.mapWidth, Level.heightPercent(this.height));

    ctx.fillStyle = Colors.street2;
    ctx.fillRect(0, this.y + Level.heightPercent(this.height*0.15), Level.mapWidth, Level.heightPercent(this.height*0.7));

    ctx.fillStyle = Colors.street3;
    ctx.fillRect(0, this.y + Level.heightPercent(this.height*0.45), Level.mapWidth, Level.heightPercent(this.height*0.1));
  }
}

export default class Bridges implements Drawable {
  bridges: Bridge[] = [];

  constructor() {
    this.bridges.push(new Bridge(500, 8))
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.bridges.forEach(bridge => {
      bridge.draw(ctx);
    });
  }
}