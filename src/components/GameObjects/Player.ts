import { Cords, GameObject } from '../Core/types';
import Input from '../Core/Input';
import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { PlaneSprite } from '../Core/Resources';

export default class Player extends Sprite implements GameObject {
  private static readonly SPRITE_IMG = PlaneSprite;
  private readonly SPEED: number = 0.02;

  constructor() {
    super(Player.SPRITE_IMG, [-1, 45], [4, 4]);
    Input.bindKeyAction('ArrowLeft', this.moveLeft);
    Input.bindKeyAction('ArrowRight', this.moveRight);
    Input.bindKeyAction('ArrowUp', this.accelerate);
    Input.bindKeyAction('ArrowDown', this.decelerate);
  }

  moveLeft = (timeElapsed: number) => {
    if (Level.map[1][0] < this.pos[0] - this.SPEED*timeElapsed) {
      this.pos[0] -= this.SPEED * timeElapsed;
      this.imgOffset = 1;
    }
  };

  moveRight = (timeElapsed: number) => {
    if (Level.hCords(Level.map[1][1]) > Level.hCords(this.pos[0] + this.SPEED*timeElapsed) + 20) {
      this.pos[0] += this.SPEED * timeElapsed;
      this.imgOffset = 2;
    }
  };

  accelerate = (timeElapsed: number) => {
    Level.scrollSpeed = Level.scrollSpeed + timeElapsed*0.001;
  }

  decelerate = (timeElapsed: number) => {
    Level.scrollSpeed = Level.scrollSpeed - timeElapsed*0.001;
  }

  update(timeElapsed: number) {
    let blocks;
    blocks = ['ArrowLeft', 'ArrowRight'];
    if (Input.keysInactive(blocks)) {
      this.imgOffset = 0;
    }

    blocks = ['ArrowUp'];
    if(Input.keysInactive(blocks)) {
      Level.speedDefault(timeElapsed);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}
