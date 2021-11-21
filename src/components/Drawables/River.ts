import { Drawable } from '../Core/types';
import { Colors } from '../Core/Resources';
import Level from '../Core/Level';

export default class River implements Drawable {
  private static readonly CURVE_OFFSET: number = 1;
  private static readonly SHORE_THICKNESS = 20;

  constructor() {}

  drawLeftCurves(ctx: CanvasRenderingContext2D) {
    Level.map.forEach((stripe, index) => {
      const left = stripe[0];
      const pre = index > 0 ? Level.map[index - 1] : [0, 0];
      const x = Level.hCords(left);
      const y =
        Level.mapHeight -
        (index * Level.mapHeight) / (Level.map.length - 2) +
        Level.scroll;
      const cx = x + Math.sign(left - pre[0]) * Level.widthPercent(River.CURVE_OFFSET);
      const cy = y + Level.heightPercent(River.CURVE_OFFSET);
      ctx.quadraticCurveTo(cx, cy, x, y);
    });
  }

  drawRightCurves(ctx: CanvasRenderingContext2D) {
    const rev = [...Level.map];
    rev.reverse();
    rev.forEach((stripe, index) => {
      const right = stripe[1];
      const pre = index > 0 ?  rev[index - 1] : [Infinity, Infinity];
      const x = Level.hCords(right);
      const y = ((index - 1) * Level.mapHeight) / (Level.map.length - 2) + Level.scroll;
      const cx = x + Math.sign(right - pre[1]) * Level.widthPercent(River.CURVE_OFFSET);
      const cy = y - Level.heightPercent(River.CURVE_OFFSET);
      // ctx.lineTo(x, y);
      ctx.quadraticCurveTo(cx, cy, x, y);
    });
  }

  drawRiver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Colors.water;
    ctx.beginPath();
    ctx.moveTo(Level.hCords(Level.map[0][0]), Level.mapHeight + Level.scroll);
    this.drawLeftCurves(ctx);
    this.drawRightCurves(ctx);
    ctx.fill();

    ctx.strokeStyle = Colors.shore;
    ctx.lineWidth = River.SHORE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(Level.hCords(Level.map[0][0]), Level.mapHeight + Level.scroll);
    this.drawLeftCurves(ctx);
    ctx.stroke();

    ctx.beginPath();
    this.drawRightCurves(ctx);
    ctx.stroke();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawRiver(ctx);

    // Only debug
    // ctx.fillStyle = 'red';
    // Level.map.forEach((stripe, index) => {
      // const left = stripe[0];
      // const x = Level.widthPercent(left) + Level.horizontalCenter;
      // const y =
        // Level.mapHeight -
        // (index * Level.mapHeight) / (Level.map.length - 2) +
        // Level.scroll;
      // ctx.fillRect(x, y, Level.widthPercent(stripe[1] - stripe[0]), 2);
    // });
  }
}
