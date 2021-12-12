import Level from '../Core/Level';
import { BridgeSprite, Colors } from '../Core/Resources';
import { Sprite } from '../Core/Sprite';
import { Collidable, Drawable } from '../Core/types';

export default class Bridges implements Drawable, Collidable {
  private static readonly SPRITE_IMG = BridgeSprite;

  constructor() {}

  isColliding(other: Sprite): boolean {
    const offsets = Level.bridges.map((b, i) => {
      if (!b) return [null, null];
      const y =
          Level.mapHeight -
          ((i - Level.downPresegments) * Level.mapHeight) /
            (Level.map.length - Level.hiddenSegments - 1) +
          Level.scroll;
      return [y, y+Level.heightPercent(8)];
    });
    const collision = offsets.findIndex(([top, bottom]) => Level.vCords(other.position[1]) > top && Level.vCords(other.position[1]) < bottom);
    return collision > -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const bridges = Level.bridges
      .map((b, i) => {
        if (!b) return;
        const y =
          Level.mapHeight -
          ((i - Level.downPresegments) * Level.mapHeight) /
            (Level.map.length - Level.hiddenSegments - 1) +
          Level.scroll;
        return new Sprite(
          Bridges.SPRITE_IMG,
          [Level.hCords(-12), y],
          [Level.widthPercent(24), Level.heightPercent(8)],
          [334, 100]
        );
      })
      .filter((b) => b);

    bridges.forEach((s) => {
      s.pureDraw(ctx);
    });
  }
}
