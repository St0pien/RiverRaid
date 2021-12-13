import Window from './Core/Window';
import Player from './GameObjects/Player';
import Input from './Core/Input';
import River from './GameObjects/River';
import Level from './Core/Level';
import Bridges from './GameObjects/Bridge';
import Ship from './GameObjects/Ship';
import Chopper from './GameObjects/Chopper';
import Baloon from './GameObjects/Baloon';
import Jet from './GameObjects/Jet';
import Fuel from './GameObjects/Fuel';
import Stats from './GameObjects/Stats';
import { Collidable, Vehicle } from './Core/types';
import { explosions } from './GameObjects/Explosions';

enum ENEMIES {
  SHIP,
  CHOPPER,
  BALOON,
  JET
}

export default class RiverRaid extends Window {
  private _player: Player;
  private _river: River;
  private _bridges: Bridges;
  private _fuels: Fuel[] = [];
  private _obstacles: Collidable[] = [];
  private _vehicles: Vehicle[] = [];
  private _nextObstacle = 500;
  private _nextFuel = 4000;
  private _stats: Stats;

  constructor() {
    super();
    Input.init();
    this._player = new Player();
    this._river = new River();
    this._bridges = new Bridges();
    this._obstacles.push(this._bridges);

    Level.onScrollJump = this.onScrollJump;

    this._stats = new Stats();
  }

  onScrollJump = () => {
    this._vehicles.forEach(vehicle => vehicle.incrementSegment());
    this._fuels.forEach(fuel => fuel.incrementSegment());
    explosions.forEach(explosion => explosion.incrementSegment());
  };

  update(timeElapsed: number) {
    if (Level.stop) {
      explosions.forEach(explosion => explosion.update(timeElapsed));
      return;
    };

    this._nextObstacle -= timeElapsed;
    this._nextFuel -= timeElapsed;
    if (this._nextObstacle < 0) {
      this._nextObstacle = Math.random() * 700 + 300;

      if (Level.canBePlaced()) {
        Level.deactivateBrdiges();
        const choice = Math.floor(
          (Math.random() * Object.keys(ENEMIES).length) / 2
        );

        let vehicle: Vehicle;
        switch (choice) {
          case ENEMIES.SHIP:
            vehicle = new Ship();
            break;
          case ENEMIES.CHOPPER:
            vehicle = new Chopper();
            break;
          case ENEMIES.BALOON:
            vehicle = new Baloon();
            break;
          case ENEMIES.JET:
            vehicle = new Jet();
            break;
        }
        this._vehicles.push(vehicle);
        this._obstacles.push(vehicle);
      }
    }

    if (this._nextFuel < 0) {
      this._nextFuel = Math.random() * 1000 + 1000;
      if (Level.canBePlaced()) {
        Level.deactivateBrdiges();
        this._fuels.push(new Fuel());
      }
    }

    this._obstacles.forEach(obstacle => {
      if (obstacle.isColliding(this._player)) {
        this._player.die();
      }
    });

    this._fuels.forEach(fuel => {
      if (fuel.isColliding(this._player)) {
        Level.fuelLevel += timeElapsed * 0.1;
      }
    });

    this._player.bullets.forEach(bullet => {
      this._obstacles.forEach(obstacle => {
        if (obstacle.isColliding(bullet) && (!obstacle.hit || obstacle instanceof Bridges)) {
          obstacle.destroy();
          bullet.destroy();
        }
      });

      this._fuels.forEach(fuel => {
        if (fuel.isColliding(bullet) && !fuel.hit) {
          fuel.destroy();
          bullet.destroy();
        }
      });
    });

    this._player.update(timeElapsed);
    Level.update(timeElapsed);
    this._vehicles.forEach(vehicle => vehicle.update(timeElapsed));
    this._vehicles = this._vehicles.filter(vehicle => vehicle.segment > 0);
    this._fuels.forEach(fuel => fuel.update(timeElapsed));
    this._fuels = this._fuels.filter(fuel => fuel.segment > 0);
    explosions.forEach(explosion => explosion.update(timeElapsed));
    explosions.filter(explosion => explosion.active);
  }

  render(timeElapsed: number) {
    Input.update(timeElapsed);
    this.update(timeElapsed);

    this._ctx.clearRect(0, 0, this.width, this.height);
    this._river.draw(this._ctx);
    this._fuels.forEach(fuel => fuel.draw(this._ctx));
    this._bridges.draw(this._ctx);
    this._vehicles.forEach(vehicle => vehicle.draw(this._ctx));
    this._player.draw(this._ctx);
    explosions.forEach(explosion => explosion.draw(this._ctx));
    this._stats.draw(this._ctx);
  }
}
