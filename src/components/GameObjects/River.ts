import { Drawable } from '../Core/types';
import { Colors } from '../Core/Resources';
import Level from '../Core/Level';

export default class River implements Drawable {
  private static readonly CURVE_OFFSET: number = 1;
  private static readonly SHORE_THICKNESS = 20;

  constructor() {}

  drawLeftCurves(ctx: CanvasRenderingContext2D, bounds: number[][]) {
    bounds.forEach((stripe, index) => {
      if (!stripe) return;

      const left = stripe[0];
      const pre = index > 0 ? Level.map[index - 1] : [0, 0];
      const x = Level.hCords(left);
      const y =
        Level.mapHeight -
        ((index - Level.downPresegments) * Level.mapHeight) /
          (Level.map.length - Level.hiddenSegments - 1) +
        Level.scroll;
      const cx =
        x + Math.sign(left - pre[0]) * Level.widthPercent(River.CURVE_OFFSET);
      const cy = y + Level.heightPercent(River.CURVE_OFFSET);
      ctx.quadraticCurveTo(cx, cy, x, y);
    });
  }

  drawRightCurves(ctx: CanvasRenderingContext2D, bounds: number[][]) {
    const rev = [...bounds];
    rev.reverse();
    rev.forEach((stripe, index) => {
      if (!stripe) return;

      const right = stripe[1];
      let pre = index > 0 ? rev[index - 1] : [Infinity, Infinity];
      pre = !pre ? [Infinity, Infinity] : pre;
      const x = Level.hCords(right);
      const y =
        ((index - Level.upPresegments) * Level.mapHeight) /
          (Level.map.length - Level.hiddenSegments - 1) +
        Level.scroll;
      const cx =
        x + Math.sign(right - pre[1]) * Level.widthPercent(River.CURVE_OFFSET);
      const cy = y - Level.heightPercent(River.CURVE_OFFSET);
      ctx.quadraticCurveTo(cx, cy, x, y);
    });
  }

  drawRiver(ctx: CanvasRenderingContext2D) {
    // Water
    ctx.fillStyle = Colors.water;
    ctx.beginPath();
    ctx.moveTo(
      Level.hCords(Level.map[0][0]),
      Level.mapHeight +
        Level.mapHeight / (Level.map.length - Level.hiddenSegments - 1) +
        Level.scroll
    );
    this.drawLeftCurves(ctx, Level.map);
    this.drawRightCurves(ctx, Level.map);
    ctx.fill();

    // LandScape
    ctx.strokeStyle = Colors.shore;
    ctx.lineWidth = River.SHORE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(
      Level.hCords(Level.map[0][0]),
      Level.mapHeight +
        Level.mapHeight / (Level.map.length - Level.hiddenSegments - 1) +
        Level.scroll
    );
    this.drawLeftCurves(ctx, Level.map);
    ctx.stroke();

    ctx.beginPath();
    this.drawRightCurves(ctx, Level.map);
    ctx.stroke();

    // Islands
    const islandMap: { [key: number]: number[][] } = {};
    let currentOffset: number;
    let last: number[];
    Level.islands.forEach((stripe, index) => {
      if (stripe) {
        if (!last) {
          currentOffset = index;
          islandMap[currentOffset] = [];
        }
        islandMap[currentOffset].push(stripe);
      }
      last = stripe;
    });
    for (let offset in islandMap) {
      let index = parseInt(offset);
      const map = [
        ...Array.from(Array(index), () => null),
        ...islandMap[offset],
        ...Array.from(
          Array(Level.islands.length - index - islandMap[offset].length),
          () => null
        )
      ];
      ctx.fillStyle = Colors.side;
      ctx.beginPath();
      ctx.moveTo(
        Level.hCords(Level.islands[index][0]),
        Level.mapHeight -
          (index * Level.mapHeight) /
            (Level.map.length - Level.hiddenSegments - 1) +
          Level.scroll +
          Level.mapHeight / (Level.map.length - Level.hiddenSegments - 1)
      );
      this.drawLeftCurves(ctx, map);
      this.drawRightCurves(ctx, map);
      ctx.fill();

      ctx.strokeStyle = Colors.shore;
      ctx.lineWidth = River.SHORE_THICKNESS;
      ctx.beginPath();
      this.drawLeftCurves(ctx, map);
      this.drawRightCurves(ctx, map);
      ctx.lineTo(
        Level.hCords(Level.islands[index][0]),
        Level.mapHeight -
          (index * Level.mapHeight) /
            (Level.map.length - Level.hiddenSegments - 1) +
          Level.scroll +
          Level.mapHeight / (Level.map.length - Level.hiddenSegments - 1)
      );
      ctx.stroke();
    }
  }

  drawBridgeStreet(ctx: CanvasRenderingContext2D, y: number, height: number) {
    ctx.fillStyle = Colors.street1;
    ctx.fillRect(0, y, Level.mapWidth, Level.heightPercent(height));

    ctx.fillStyle = Colors.street2;
    ctx.fillRect(
      0,
      y + Level.heightPercent(height * 0.15),
      Level.mapWidth,
      Level.heightPercent(height * 0.7)
    );

    ctx.fillStyle = Colors.street3;
    ctx.fillRect(
      0,
      y + Level.heightPercent(height * 0.45),
      Level.mapWidth,
      Level.heightPercent(height * 0.1)
    );
  }

  drawBridgesStreets(ctx: CanvasRenderingContext2D) {
    Level.bridges.forEach((bridge, index) => {
      if (!bridge) return;

      const y =
        Level.mapHeight -
        ((index - Level.downPresegments) * Level.mapHeight) /
          (Level.map.length - Level.hiddenSegments - 1) +
        Level.scroll;
      this.drawBridgeStreet(ctx, y, 8);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawBridgesStreets(ctx);
    this.drawRiver(ctx);

    // Only debug
    // ctx.fillStyle = 'red';
    // Level.map.forEach((stripe, index) => {
      // const left = stripe[0];
      // const x = Level.hCords(left);
      // const y =
        // Level.mapHeight -
        // ((index - Level.downPresegments) * Level.mapHeight) /
          // (Level.map.length - Level.hiddenSegments - 1) +
        // Level.scroll;
      // ctx.fillRect(x, y, Level.widthPercent(stripe[1] - stripe[0]), 2);
    // });
  }
}
