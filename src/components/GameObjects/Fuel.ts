import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { Vehicle } from '../Core/types';
import { FuelSprite } from '../Core/Resources';

export default class Fuel extends Sprite implements Vehicle {
  private static readonly SPRITE_IMG = FuelSprite;
  private _index: number;

  constructor() {
    const [left, right] = Level.map[Level.map.length - 1];
    const lastIsland = Level.islands[Level.map.length - 1];
    let x;
    do {
      x = Math.random() * (right - left - 15) + left + 15;
    } while (lastIsland && lastIsland[0] < x && lastIsland[1] > x);
    super(Fuel.SPRITE_IMG, [x, 0], [4, 10], [100, 171]);
    this._index = Level.map.length-1;
  }

  incrementSegment() {
    this._index--;
  }

  get segment() {
    return this._index;
  };

  isColliding(other: Sprite): boolean {
    return Math.abs(other.position[0] - this.pos[0]) * 2 < other.width / 2 + this.width / 2 && Math.abs(other.position[1] - this.pos[1]) * 1.5 < other.height / 2 + this.height / 2
  }

  update(timeElapsed: number) {
    if (this._index < 0) return;

    const y = (Level.map.length - 1 - this._index-Level.upPresegments) * 100 / (Level.map.length - Level.hiddenSegments - 1) - 50 + (Level.scroll / Level.heightPercent(1));
    this.pos[1] = y;
  }
}
