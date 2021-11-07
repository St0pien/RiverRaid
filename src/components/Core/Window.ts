import Level from "./Level";

export default class Window {
  protected _canvas: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _frame: number;
  protected _previousTime: number = 0;

  constructor() {
    this._canvas = document.createElement('canvas');
    this._canvas.classList.add('window');
    this._canvas.style.backgroundColor = 'green';
    document.body.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');

    this.setSize();
    window.addEventListener('resize', () => this.setSize());
  }

  private setSize() {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    Level.mapWidth = this.width;
    Level.mapHeight = this.height;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  render(timeElapsed: number) {}

  start() {
    const frame = (timeElapsed: number) => {
      this.render(timeElapsed - this._previousTime);
      this._previousTime = timeElapsed;
      this._frame = requestAnimationFrame(frame);
    };

    this._frame = requestAnimationFrame(frame);
  }

  stop() {
    cancelAnimationFrame(this._frame);
  }
}
