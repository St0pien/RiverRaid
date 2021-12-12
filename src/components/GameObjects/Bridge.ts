import Level from '../Core/Level';
import { BridgeSprite, Colors } from '../Core/Resources';
import { Sprite } from '../Core/Sprite';
import { Drawable } from '../Core/types';

export default class Bridges implements Drawable {
  private static readonly SPRITE_IMG = BridgeSprite;

  constructor() {}

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
