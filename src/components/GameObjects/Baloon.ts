import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { Vehicle } from '../Core/types';
import { BaloonSprite } from '../Core/Resources';

enum SIDE {
  LEFT,
  RIGHT
}

export default class Baloon extends Sprite implements Vehicle {
  private static readonly SPRITE_IMG = BaloonSprite;
  private _index: number;
  private _side: SIDE;
  private _shouldMove: [boolean, boolean];

  constructor() {
    const [left, right] = Level.map[Level.map.length - 1];
    const lastIsland = Level.islands[Level.map.length - 1];
    let x;
    do {
      x = Math.random() * (right - left - 6) + left + 6;
    } while (lastIsland && lastIsland[0] < x && lastIsland[1] > x);
    super(Baloon.SPRITE_IMG, [x, 0], [7, 8], [100, 122]);
    this._index = Level.map.length-1;

    if (Math.abs(this.pos[0] - left) < Math.abs(this.pos[0] - right)) {
      this._side = SIDE.LEFT;
    } else {
      this._side = SIDE.RIGHT;
    }

    this._shouldMove = [false, false];
  }

  incrementSegment() {
    this._index--;
  }

  get segment() {
    return this._index;
  };

  isColliding(other: Sprite): boolean {
    return Math.abs(other.position[0] - this.pos[0]) * 1.5 < other.width / 2 + this.width / 2 && Math.abs(other.position[1] - this.pos[1]) * 1.5 < other.height / 2 + this.height / 2
  }

  update(timeElapsed: number) {
    if (this._index < 0) return;

    const y = (Level.map.length - 1 - this._index-Level.upPresegments) * 100 / (Level.map.length - Level.hiddenSegments - 1) - 50 + (Level.scroll / Level.heightPercent(1));
    this.pos[1] = y;

    if (this._index < Level.map.length * 0.5 && !this._shouldMove[0]) {
      this._shouldMove[0] = true;
      if (Math.random() < 0.5) {
        this._shouldMove[1] = true;
      }
    }

    if (this._shouldMove[1]) {
      if (Math.abs(Level.map[this._index][this._side^1] - this.pos[0]) < 6) return;
      if (Level.islands[this._index] && Math.abs(Level.islands[this._index][this._side] - this.pos[0]) < 6) return;

      const multiplier = this._side == SIDE.LEFT ? 1 : -1;
      this.pos[0] += timeElapsed*multiplier*0.007;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
