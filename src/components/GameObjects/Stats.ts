import Level from '../Core/Level';
import { StatsSprite, Colors } from '../Core/Resources';
import { Sprite } from '../Core/Sprite';

export default class Stats extends Sprite {
  private static readonly SPRITE_IMG = StatsSprite;
  private readonly LEFT = Level.hCords(0) - Level.heightPercent(17);
  private readonly RIGHT = Level.hCords(0) + Level.heightPercent(15);
  private _percetage: number;

  constructor() {
    super(Stats.SPRITE_IMG, [0, 46], [40, 8], [401, 92]);
    Level.onFuelUpdate = val => {
      this._percetage = val;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, Level.mapHeight - Level.heightPercent(8), Level.mapWidth, Level.heightPercent(8));
    super.draw(ctx);
    ctx.fillStyle = Colors.fuel;
    ctx.fillRect(this.LEFT + (this.RIGHT - this.LEFT) / 100 * this._percetage, Level.vCords(43), 20, Level.heightPercent(8));
  }
}
