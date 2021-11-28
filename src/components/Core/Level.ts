export default class Level {
  private static _scroll = 0;
  private static readonly SCROLL_SPEED = 0.3;

  private static readonly SHORE_THICKNESS = 10;
  private static readonly SEGMENT_COUNT = 39;
  private static readonly RIVER_CHANGE_CHANCE = 0.5;
  private static readonly MIN_RIVER_WIDTH = 30;
  private static readonly MAX_RIVER_WIDTH = 60;
  private static readonly RANDOMNESS_RATIO = 5;

  private static readonly ISLAND_SPAWN_CHANCE = 0.005;
  private static readonly MIN_ISLAND_SEGMENTS = 5;
  private static readonly MAX_ISLAND_SEGMENTS = 30;

  private static _map: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => [-15, 15]
  );

  private static _islands: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => null
  );

  private static islandCount = 0;

  static mapWidth: number = -1;
  static mapHeight: number = -1;
  static upPresegments: number = 2;
  static downPresegments: number = 1;

  static get hiddenSegments() {
    return this.upPresegments + this.downPresegments;
  }

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

  static get islands() {
    return this._islands;
  }

  static get scroll() {
    return this._scroll;
  }

  private static generateBoundaries(
    lastLeft: number,
    lastRight: number,
    changeChance: number,
    randomnessRatio: number,
    minWidth: number,
    maxWidth: number
  ): number[] {
    let shouldChange = Math.random() < changeChance ? -1 : 1;
    let left =
      lastLeft - Math.floor(Math.random() * randomnessRatio) * shouldChange;
    if (left < -(50 - this.SHORE_THICKNESS)) {
      left = -(50 - this.SHORE_THICKNESS);
    }

    shouldChange = Math.random() < changeChance ? -1 : 1;
    let right =
      lastRight + Math.floor(Math.random() * randomnessRatio) * shouldChange;
    if (right > 50-this.SHORE_THICKNESS) {
      right = 50-this.SHORE_THICKNESS;
    }

    if (Math.abs(right - left) < minWidth) {
      do {
        left--;
        right++;
      } while (Math.abs(right - left) < minWidth);
    }

    if (Math.abs(right - left) > maxWidth) {
      do {
        left++;
        right--;
      } while (Math.abs(right - left) > maxWidth);
    }

    return [left, right];
  }

  private static generateBaseShape() {
    this.map.shift();
    this._scroll = 0;
    const [lastLeft, lastRight] = this.map[this.map.length - 1];

    this.map.push(
      this.generateBoundaries(
        lastLeft,
        lastRight,
        this.RIVER_CHANGE_CHANCE,
        this.RANDOMNESS_RATIO,
        this.MIN_RIVER_WIDTH,
        this.MAX_RIVER_WIDTH
      )
    );
  }

  private static generateIslands() {
    const spawnIsland = Math.random();
    if (spawnIsland <= this.ISLAND_SPAWN_CHANCE && this.islandCount == 0) {
      this.islandCount = Math.floor(Math.random() * this.MIN_ISLAND_SEGMENTS) + this.MAX_ISLAND_SEGMENTS;
    }

    this.islands.shift();
    if (this.islandCount > 0) {
      const last = this.islands[this.islands.length - 1];
      const [lastLeft, lastRight] = last ? last : this.map[this.map.length - 1];
      let [left, right] = this.generateBoundaries(lastLeft, lastRight, this.RIVER_CHANGE_CHANCE, this.RANDOMNESS_RATIO, this.MIN_RIVER_WIDTH, this.MAX_RIVER_WIDTH/3);

      const lastMap = this.map[this.map.length - 1];
      if (Math.abs(left - lastMap[0]) < this.MIN_RIVER_WIDTH) {
        lastMap[0] = (left - (50 - this.SHORE_THICKNESS / 2)) / 2;
        left += 5;
      }
      console.log(Math.abs(left - lastMap[0]));
      if (Math.abs(right - lastMap[1]) < this.MIN_RIVER_WIDTH) {
        lastMap[1] = (right + 50 - this.SHORE_THICKNESS / 2) / 2;
        right -= 5;
      }


      this.islands.push([left, right]);
    } else {
      this.islands.push(null);
    }

    if (this.islandCount > 0) {
      this.islandCount--;
    }
  }

  static update(timeElapsed: number) {
    this._scroll += timeElapsed * this.SCROLL_SPEED;

    if (
      this.scroll >=
      this.mapHeight / (this.map.length - this.hiddenSegments - 1)
    ) {
      this.generateIslands();
      this.generateBaseShape();
    }
  }
}
