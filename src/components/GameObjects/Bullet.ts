import { Sprite } from '../Core/Sprite';
import { BulletSprite } from '../Core/Resources';
import { Cords, GameObject } from '../Core/types';
import Level from '../Core/Level';

export default class Bullet extends Sprite implements GameObject {
  private static readonly SPRITE_IMG = BulletSprite
  destroyed: boolean;

  constructor(pos: Cords) {
    super(Bullet.SPRITE_IMG, pos, [0.8, 4], [11, 50]);
  }

  destroy() {
    this.pos[1] = -100;
    this.destroyed = true;
  }

  update(timeElapsed: number) {
    this.pos[1] -= timeElapsed*0.1;
  }
}