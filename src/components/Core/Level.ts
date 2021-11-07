export default class Level {
  private static _scroll = 0;
  private static readonly SCROLL_SPEED = 0.2;

  private static _map: number[][] = [
    [-15, 15],
    [-15, 15],
    [-15, 15],
    [-15, 15],
    [-15, 15]
  ];

  private static islands: number[][] = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ]

  static mapWidth: number = -1;
  static mapHeight: number = -1;

  static get horizontalCenter() {
    return this.mapWidth / 2;
  }

  static get verticalCenter() {
    return this.mapHeight / 2;
  }

  static widthPercent(val: number) {
    return val*0.01*this.mapWidth;
  }

  static heightPercent(val: number) {
    return val*0.01*this.mapHeight;
  }

  static hCords(val: number) {
    return this.widthPercent(val) + this.horizontalCenter;
  }

  static vCords(val: number) {
    return this.heightPercent(val) + this.verticalCenter
  }

  static get map() {
    return this._map;
  }

  static get scroll() {
    return this._scroll;
  }

  static generateRiver() {
    for (let i = 0; i < 5; i++) {}
  }

  static update(timeElapsed: number) {
    this._scroll += timeElapsed*this.SCROLL_SPEED;
    if (this.scroll >= this.mapHeight / (this.map.length-2)) {
      this.map.shift();
      this._scroll = 0;
      const shouldChange = Math.random() * 2;
      if (shouldChange > 1.3) {
        const multiplier = Math.floor(Math.random() * 6) + 2;
        this.map.push([-5*multiplier, 5*multiplier]);
      } else {
        const last = this.map[this.map.length-1];
        this.map.push([last[0], last[1]]);
      }
    }
  }
}
