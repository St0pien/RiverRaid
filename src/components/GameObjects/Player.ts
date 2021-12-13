import { GameObject } from '../Core/types';
import Input from '../Core/Input';
import Level from '../Core/Level';
import { Sprite } from '../Core/Sprite';
import { PlaneSprite } from '../Core/Resources';
import Bullet from './Bullet';
import { explosions } from './Explosions';
import Explosion from './Explosion';

export default class Player extends Sprite implements GameObject {
  private static readonly SPRITE_IMG = PlaneSprite;
  private static readonly COLLIDER_MULTIPLIER = 0.85;
  private readonly SPEED: number = 0.015;
  private _bullets: Bullet[] = [];
  private _bulletDelay: number = 0;

  constructor() {
    super(Player.SPRITE_IMG, [-1, 35], [5, 5], [100, 100]);
    Input.bindKeyAction('ArrowLeft', this.moveLeft);
    Input.bindKeyAction('ArrowRight', this.moveRight);
    Input.bindKeyAction('ArrowUp', this.accelerate);
    Input.bindKeyAction('ArrowDown', this.decelerate);
    Input.bindKeyAction('Space', this.shoot);
  }

  get bullets() {
    return this._bullets;
  }

  shoot = (timeElapsed: number) => {
    if (this._bulletDelay < 0) {
      this._bullets.push(new Bullet([...this.pos]));
      this._bulletDelay = 200;
    }
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
    Level.stop = true;
    explosions.push(new Explosion([...this.pos], [this.size[0]*2, this.size[1]*2], 300, 7));
    setTimeout(() => {
      (document.querySelector('.over') as HTMLElement).style.display = 'block';
    }, 1000);
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

    this._bulletDelay -= timeElapsed;
    // this._bullets = this._bullets.filter(b => !b.destroyed);
    this._bullets.forEach(bullet => bullet.update(timeElapsed));
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (Level.stop) return;
    super.draw(ctx);
    this._bullets.forEach(bullet => bullet.draw(ctx));
  }
}
