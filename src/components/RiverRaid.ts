import Window from './Core/Window';
import Player from './GameObjects/Player';
import Input from './Core/Input';
import River from './GameObjects/River';
import Level from './Core/Level';
import Bridges from './GameObjects/Bridge';
import Ship from './GameObjects/Ship';
import { Collidable } from './Core/types';

export default class RiverRaid extends Window {
  private _player: Player;
  private _river: River;
  private _bridges: Bridges;
  private _obstacles: Collidable[] = [];
  private _ships: Ship[] = [];

  constructor() {
    super()
    Input.init();
    this._player = new Player();
    this._river = new River();
    this._bridges = new Bridges();
    this._obstacles.push(this._bridges);

    setInterval(() => {
      if (Ship.canBePlaced()) {
        const ship = new Ship();
        this._ships.push(ship);
        this._obstacles.push(ship);
      }
    }, 2000);

    Level.onScrollJump = this.onScrollJump;
  }

  onScrollJump = () => {
    this._ships.forEach(ship => ship.incrementSegment());
  }

  update(timeElapsed: number) {
    this._player.update(timeElapsed);
    Level.update(timeElapsed);
    this._ships.forEach(ship => ship.update(timeElapsed));

    this._obstacles.forEach(obstacle => {
      if (obstacle.isColliding(this._player)) {
        this._player.die();
      }
    });
  }

  render(timeElapsed: number) {
    Input.update(timeElapsed);
    this.update(timeElapsed);
    
    this._ctx.clearRect(0, 0, this.width, this.height);
    this._river.draw(this._ctx);
    this._bridges.draw(this._ctx);
    this._player.draw(this._ctx);
    this._ships.forEach(ship => ship.draw(this._ctx));
  }
}
