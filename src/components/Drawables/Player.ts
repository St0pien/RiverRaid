import { Cords, GameObject } from '../Core/types';
import Input from '../Core/Input';
import Level from '../Core/Level';

export default class Player implements GameObject {
  private _pos: Cords;
  private _speed: number = 0.02;

  constructor() {
    this._pos = [-1, 48];
    Input.bindKeyAction('ArrowLeft', this.moveLeft);
    Input.bindKeyAction('ArrowRight', this.moveRight);
  }

  moveLeft = (timeElapsed: number) => {
    if (Level.map[1][0] < this._pos[0] - this._speed*timeElapsed) {
      this._pos[0] -= this._speed * timeElapsed;
    }
  };

  moveRight = (timeElapsed: number) => {
    if (Level.hCords(Level.map[1][1]) > Level.hCords(this._pos[0] + this._speed*timeElapsed) + 20) {
      this._pos[0] += this._speed * timeElapsed;
    }
  };

  update(timeElapsed: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    const [x, y] = this._pos;
    ctx.fillRect(Level.hCords(x), Level.vCords(y), 20, 20);
  }
}
