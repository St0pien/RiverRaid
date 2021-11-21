export default class Level {
  private static _scroll = 0;
  private static readonly SCROLL_SPEED = 0.3;

  private static readonly SEGMENT_COUNT = 39;
  private static readonly RIVER_CHANGE_CHANCE = 0.5;
  private static readonly MIN_RIVER_WIDTH = 15;
  private static readonly MAX_RIVER_WIDTH = 60;
  private static readonly RANDOMNESS_RATIO = 5;

  private static _map: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => [-15, 15]
  );

  private static islands: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => null
  );

  private static islandCount = 0;

  static mapWidth: number = -1;
  static mapHeight: number = -1;

  static get horizontalCenter() {
    return this.mapWidth / 2;
  }

  static get verticalCenter() {
    return this.mapHeight / 2;
  }

  static widthPercent(val: number) {
    return val * 0.01 * this.mapWidth;
  }

  static heightPercent(val: number) {
    return val * 0.01 * this.mapHeight;
  }

  static hCords(val: number) {
    return this.widthPercent(val) + this.horizontalCenter;
  }

  static vCords(val: number) {
    return this.heightPercent(val) + this.verticalCenter;
  }

  static get map() {
    return this._map;
  }

  static get scroll() {
    return this._scroll;
  }

  private static generateBaseShape() {
    this.map.shift();
    this._scroll = 0;
    const [lastLeft, lastRight] = this.map[this.map.length - 1];

    let shouldChange = Math.random() < this.RIVER_CHANGE_CHANCE ? -1 : 1;
    let left =
      lastLeft -
      Math.floor(Math.random() * this.RANDOMNESS_RATIO) * shouldChange;
    if (left < -50) {
      left = -50;
    }

    shouldChange = Math.random() < this.RIVER_CHANGE_CHANCE ? -1 : 1;
    let right =
      lastRight +
      Math.floor(Math.random() * this.RANDOMNESS_RATIO) * shouldChange
    if (right > 50) {
      right = 50;
    }

    if (Math.abs(right - left) < this.MIN_RIVER_WIDTH) {
      do {
        left--;
        right++;
      } while (Math.abs(right - left) < this.MIN_RIVER_WIDTH);
    }

    if (Math.abs(right - left) > this.MAX_RIVER_WIDTH) {
      do {
        left++;
        right--;
      } while (Math.abs(right - left) > this.MAX_RIVER_WIDTH);
    }

    this.map.push([left, right]);
  }

  private static generateIslands() {
    const spawnIsland = Math.random();
    if (spawnIsland <= 0.1 && this.islandCount == 0) {
      this.islandCount = Math.floor(Math.random() * 20) + 10;
    }

    if (this.islandCount > 0) {
      this.islandCount--;
    }
  }

  static update(timeElapsed: number) {
    this._scroll += timeElapsed * this.SCROLL_SPEED;

    if (this.scroll >= this.mapHeight / (this.map.length - 2)) {
      this.generateIslands();
      this.generateBaseShape();
    }
  }
}
