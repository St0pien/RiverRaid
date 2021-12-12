import Window from './Core/Window';
import Player from './GameObjects/Player';
import Input from './Core/Input';
import River from './GameObjects/River';
import Level from './Core/Level';
import Bridges from './GameObjects/Bridge';
import Ship from './GameObjects/Ship';
import Chopper from './GameObjects/Chopper';
import { Collidable, Vehicle } from './Core/types';

enum ENEMIES {
  SHIP,
  CHOPPER
}

export default class RiverRaid extends Window {
  private _player: Player;
  private _river: River;
  private _bridges: Bridges;
  private _obstacles: Collidable[] = [];
  private _vehicles: Vehicle[] = [];

  constructor() {
    super();
    Input.init();
    this._player = new Player();
    this._river = new River();
    this._bridges = new Bridges();
    this._obstacles.push(this._bridges);

    setInterval(() => {
      if (Level.canBePlaced()) {
        const choice = Math.floor(
          Math.random() * Object.keys(ENEMIES).length / 2
        );

        let vehicle: Vehicle;
        switch (choice) {
          case ENEMIES.SHIP:
            vehicle = new Ship();
            break;
          case ENEMIES.CHOPPER:
            vehicle = new Chopper();
            break;
        }
        this._vehicles.push(vehicle);
        this._obstacles.push(vehicle);
      }
    }, 2000);

    Level.onScrollJump = this.onScrollJump;
  }

  onScrollJump = () => {
    this._vehicles.forEach((vehicle) => vehicle.incrementSegment());
  };

  update(timeElapsed: number) {
    this._player.update(timeElapsed);
    Level.update(timeElapsed);
    this._vehicles.forEach((vehicle) => vehicle.update(timeElapsed));
    this._vehicles = this._vehicles.filter(vehicle => vehicle.segment > 0);

    this._obstacles.forEach((obstacle) => {
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
    this._vehicles.forEach((vehicle) => vehicle.draw(this._ctx));
  }
}
