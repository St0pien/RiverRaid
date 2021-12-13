import { ExplosionSprite } from '../Core/Resources';
import Level from '../Core/Level';
import Sprite from '../Core/Sprite';
import { Cords } from '../Core/types';

export default class Explosion extends Sprite {
  private static readonly SPRITE_IMG = ExplosionSprite;
  private _duration = 0;
  private _delay: number;
  private _index: number;
  active: boolean = true;

  constructor(pos: Cords, size: Cords, delay: number, index: number) {
    super(Explosion.SPRITE_IMG, pos, size, [100, 100], 6, delay / 6);
    this._delay = delay;
    this._index = index;
  }

  incrementSegment() {
    this._index--;
  }

  get segment() {
    return this._index;
  }

  update(timeElapsed: number) {
    super.update(timeElapsed);
    this._duration += timeElapsed;
    if (this._duration > this._delay) {
      this.active = false;
    }
    const y =
      ((Level.map.length - 1 - this._index - Level.upPresegments) * 100) /
        (Level.map.length - Level.hiddenSegments - 1) -
      50 +
      Level.scroll / Level.heightPercent(1);
    this.pos[1] = y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.active) {
      super.draw(ctx);
    }
  }
}
