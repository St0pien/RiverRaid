import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { Vehicle, SIDE } from '../Core/types';
import { JetSprite } from '../Core/Resources';
import { explosions } from './Explosions';
import Explosion from './Explosion';

export default class Jet extends Sprite implements Vehicle {
  private static readonly SPRITE_IMG = JetSprite;
  private _index: number;
  private _side: SIDE;
  private _shouldMove: boolean;
  hit: boolean;

  constructor() {
    super(Jet.SPRITE_IMG, [0, 0], [6, 3], [85, 50]);
    this._index = Level.map.length-1;

    this._side = Math.floor(Math.random() * 2);
    if (this._side == SIDE.LEFT) {
      this.pos[0] = -60;
      this.imgOffset = 1;
    } else {
      this.pos[0] = 60;
      this.imgOffset = 0;
    }

    this._shouldMove = false
  }

  incrementSegment() {
    this._index--;
  }

  get segment() {
    return this._index;
  }

  destroy() {
    explosions.push(new Explosion([...this.pos], [...this.size], 300, this._index));
    this._index = -1;
    this.hit = true;
  }

  isColliding(other: Sprite): boolean {
    return Math.abs(other.position[0] - this.pos[0]) * 1.5 < other.width / 2 + this.width / 2 && Math.abs(other.position[1] - this.pos[1]) * 1.8 < other.height / 2 + this.height / 2
  }

  update(timeElapsed: number) {
    if (this._index < 0) return;

    const y = (Level.map.length - 1 - this._index-Level.upPresegments) * 100 / (Level.map.length - Level.hiddenSegments - 1) - 50 + (Level.scroll / Level.heightPercent(1));
    this.pos[1] = y;

    if (this._index < Level.map.length * 0.8 && !this._shouldMove) {
        this._shouldMove = true;
    }

    if (this._shouldMove) {
      const multiplier = this._side == SIDE.LEFT ? 1 : -1;
      this.pos[0] += timeElapsed*multiplier*0.05;

      if (Math.abs(this.pos[0]) > 60) {
        this.pos[0] = -multiplier*60;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
