import Window from './Core/Window';
import Player from './Drawables/Player';
import Input from './Core/Input';
import River from './Drawables/River';
import Level from './Core/Level';

export default class RiverRaid extends Window {
  private _player: Player;
  private _river: River;

  constructor() {
    super()
    Input.init();
    this._player = new Player();
    this._river = new River();
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
    this._player.draw(this._ctx);
  }
}
