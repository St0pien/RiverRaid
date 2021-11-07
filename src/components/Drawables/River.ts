import { Drawable } from '../Core/types';
import { Colors } from '../Core/Resources';
import Level from '../Core/Level';

export default class River implements Drawable {
  constructor() {

  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Colors.water;
    ctx.beginPath();
    ctx.moveTo(Level.hCords(Level.map[0][0]), Level.mapHeight + Level.scroll);
    Level.map.forEach((stripe, index) => {
      const left = stripe[0];
      const x = Level.hCords(left);
      const y = Level.mapHeight - index*Level.mapHeight/(Level.map.length-2) + Level.scroll;
      ctx.lineTo(x, y);
    });
    
    const rev = [...Level.map]
    rev.reverse();
    rev.forEach((stripe, index) => {
      const right = stripe[1];
      const x = Level.hCords(right);
      const y = (index-1)*Level.mapHeight/(Level.map.length-2) + Level.scroll;
      ctx.lineTo(x, y);
    });
    
    ctx.fill();

    ctx.fillStyle = 'red';
    Level.map.forEach((stripe, index) => {
      const left = stripe[0];
      const x = Level.widthPercent(left)+Level.horizontalCenter;
      const y = Level.mapHeight - index*Level.mapHeight/(Level.map.length-2) + Level.scroll;
      ctx.fillRect(x, y, Level.widthPercent(stripe[1]-stripe[0]), 2);
    });
  }
}