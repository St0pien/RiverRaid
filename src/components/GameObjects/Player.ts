import { Cords, GameObject } from '../Core/types';
import Input from '../Core/Input';
import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { PlaneSprite } from '../Core/Resources';

export default class Player extends Sprite implements GameObject {
  private static readonly SPRITE_IMG = PlaneSprite;
  private static readonly COLLIDER_MULTIPLIER = 0.85;
  private readonly SPEED: number = 0.02;

  constructor() {
    super(Player.SPRITE_IMG, [-1, 38], [5, 5], [100, 100]);
    Input.bindKeyAction('ArrowLeft', this.moveLeft);
    Input.bindKeyAction('ArrowRight', this.moveRight);
    Input.bindKeyAction('ArrowUp', this.accelerate);
    Input.bindKeyAction('ArrowDown', this.decelerate);
  }

  moveLeft = (timeElapsed: number) => {
    this.pos[0] -= this.SPEED * timeElapsed;
    this.imgOffset = 1;
  };

  moveRight = (timeElapsed: number) => {
    this.pos[0] += this.SPEED * timeElapsed;
    this.imgOffset = 2;
  };

  accelerate = (timeElapsed: number) => {
    Level.scrollSpeed +=
      timeElapsed * 0.002 * (Level.MAX_SCROLL_SPEED - Level.scrollSpeed);
  };

  decelerate = (timeElapsed: number) => {
    Level.scrollSpeed +=
      timeElapsed * 0.002 * (Level.MIN_SCROLL_SPEED - Level.scrollSpeed);
  };

  die() {
    alert('You died!');
  }

  get corners() {
    const leftTop = [
      Level.hCords(
        this.pos[0] - (this.size[0] / 2) * Player.COLLIDER_MULTIPLIER
      ),
      Level.vCords(
        this.pos[1] - (this.size[1] / 2) * Player.COLLIDER_MULTIPLIER
      )
    ];
    const rightTop = [
      Level.hCords(
        this.pos[0] + (this.size[0] / 2) * Player.COLLIDER_MULTIPLIER - 2.5
      ),
      Level.vCords(
        this.pos[1] - (this.size[1] / 2) * Player.COLLIDER_MULTIPLIER
      )
    ];

    const leftBottom = [
      Level.hCords(
        this.pos[0] - (this.size[0] / 2) * Player.COLLIDER_MULTIPLIER
      ),
      Level.vCords(
        this.pos[1] + (this.size[1] / 2) * Player.COLLIDER_MULTIPLIER
      )
    ];
    const rightBottom = [
      Level.hCords(
        this.pos[0] + (this.size[0] / 2) * Player.COLLIDER_MULTIPLIER - 2.5
      ),
      Level.vCords(
        this.pos[1] + (this.size[1] / 2) * Player.COLLIDER_MULTIPLIER
      )
    ];

    return [leftBottom, leftTop, rightBottom, rightTop];
  }

  update(timeElapsed: number) {
    let blocks;
    blocks = ['ArrowLeft', 'ArrowRight'];
    if (
      Input.keysInactive(blocks) ||
      (Input.keyMap[blocks[0]] && Input.keyMap[blocks[1]])
    ) {
      this.imgOffset = 0;
    }

    blocks = ['ArrowUp'];
    if (Input.keysInactive(blocks)) {
      Level.speedDefault(timeElapsed);
    }

    this.corners.forEach((corner) => {
      if (!Level.isBetweenShores(corner[0], corner[1])) {
        this.die();
      }
    });

    if (Level.fuelLevel < 2) {
      this.die();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}
