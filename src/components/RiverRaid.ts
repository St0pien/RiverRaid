import Window from './Core/Window';
import Player from './GameObjects/Player';
import Input from './Core/Input';
import River from './GameObjects/River';
import Level from './Core/Level';
import Bridges from './GameObjects/Bridge';

export default class RiverRaid extends Window {
  private _player: Player;
  private _river: River;
  private _bridges: Bridges;

  constructor() {
    super()
    Input.init();
    this._player = new Player();
    this._river = new River();
    this._bridges = new Bridges();
  }

  update(timeElapsed: number) {
    this._player.update(timeElapsed);
    Level.update(timeElapsed);
  }

  render(timeElapsed: number) {
    Input.update(timeElapsed);
    this.update(timeElapsed);
    
    this._ctx.clearRect(0, 0, this.width, this.height);
    this._river.draw(this._ctx);
    this._bridges.draw(this._ctx);
    this._player.draw(this._ctx);
  }
}
