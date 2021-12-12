export default class Level {
  static readonly MAX_SCROLL_SPEED = 1;
  static readonly MIN_SCROLL_SPEED = 0;
  private static _scroll = 0;
  private static readonly DEFAULT_SCROLL_SPEED = 0.4;
  private static SCROLL_SPEED = this.DEFAULT_SCROLL_SPEED;

  private static readonly SHORE_THICKNESS = 10;
  private static readonly SEGMENT_COUNT = 45;
  private static readonly RIVER_CHANGE_CHANCE = 0.5;
  private static readonly MIN_RIVER_WIDTH = 30;
  private static readonly MAX_RIVER_WIDTH = 60;
  private static readonly RANDOMNESS_RATIO = 5;

  private static readonly ISLAND_SPAWN_CHANCE = 0.005;
  private static readonly MIN_ISLAND_SEGMENTS = 5;
  private static readonly MAX_ISLAND_SEGMENTS = 30;

  private static readonly BRIDGE_SPAWN_CHANCE = 0.005;

  private static _map: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => [-15, 15]
  );

  private static _islands: number[][] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => null
  );

  private static _bridges: boolean[] = Array.from(
    Array(this.SEGMENT_COUNT),
    () => false
  );

  private static islandCount = 0;

  static mapWidth: number = -1;
  static mapHeight: number = -1;
  static upPresegments: number = 10;
  static downPresegments: number = 1;

  static onScrollJump: () => void;

  private static bridgeSpace = 0;

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

  static get bridges() {
    return this._bridges;
  }

  static get scroll() {
    return this._scroll;
  }

  static get scrollSpeed() {
    return this.SCROLL_SPEED;
  }

  static set scrollSpeed(val: number) {
    if (val > this.MAX_SCROLL_SPEED) {
      val = this.MAX_SCROLL_SPEED;
    }

    if (val < this.MIN_SCROLL_SPEED) {
      val = this.MIN_SCROLL_SPEED;
    }

    this.SCROLL_SPEED = val;
  }

  static speedDefault(timeElapsed: number) {
    this.SCROLL_SPEED +=
      timeElapsed * 0.002 * (this.DEFAULT_SCROLL_SPEED - this.SCROLL_SPEED);
  }

  static getNearStripes(y: number): number[] {
    let heightMap = this.map.map((_, index) =>
      Math.abs(
        y -
          (Level.mapHeight -
            ((index - Level.downPresegments) * Level.mapHeight) /
              (Level.map.length - Level.hiddenSegments - 1) +
            Level.scroll)
      )
    );

    const yIndex = heightMap.indexOf(Math.min(...heightMap));
    heightMap[yIndex] = Infinity
    const y2Index = heightMap.indexOf(Math.min(...heightMap));
    return [y2Index, yIndex];
  }

  /**
   * @param  {number} y1 Index of the first of the stripes between which boundaries are calculated
   * @param  {number} y2 Index of the first of the stripes between which boundaries are calculated
   */
  static calculteLinearX(
    y1: number,
    y2: number,
    y: number,
    leftSide = true,
    map: number[][] = this.map
  ): number {
    const xa = Level.hCords(map[y1][leftSide ? 0 : 1]);
    const ya =
      Level.mapHeight -
      ((y1 - Level.downPresegments) * Level.mapHeight) /
        (Level.map.length - Level.hiddenSegments - 1) +
      Level.scroll;
    const xb = Level.hCords(map[y2][leftSide ? 0 : 1]);
    const yb =
      Level.mapHeight -
      ((y2 - Level.downPresegments) * Level.mapHeight) /
        (Level.map.length - Level.hiddenSegments - 1) +
      Level.scroll;
    return (xa * (y - yb) - xb * (y - ya)) / (ya - yb);
  }

  static isBetweenShores(x: number, y: number) {
    const [y1, y2] = this.getNearStripes(y);
    const wallXLeft = this.calculteLinearX(y1, y2, y);
    const wallXRight = this.calculteLinearX(y1, y2, y, false);

    let isBetween = true;

    if (this.islands[y1] && this.islands[y2]) {
      const islandXLeft = this.calculteLinearX(y1, y2, y, true, this.islands);
      const islandXRight = this.calculteLinearX(y1, y2, y, false, this.islands);

      if (x > islandXLeft && x < islandXRight) isBetween = false;
    }

    if (x < wallXLeft) isBetween = false;
    if (x > wallXRight) isBetween = false;

    return isBetween;
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
    if (right > 50 - this.SHORE_THICKNESS) {
      right = 50 - this.SHORE_THICKNESS;
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

    if (this.bridgeSpace > 0) {
      this.bridgeSpace--;
      this.map.push([-10 - Math.random(), 10 + Math.random()]);
      return;
    }

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
    const firstBridges = this.bridges.slice(-10, this.bridges.length);
    const noBridges = firstBridges.indexOf(true) == -1;

    const spawnIsland = Math.random();
    if (
      spawnIsland <= this.ISLAND_SPAWN_CHANCE &&
      this.islandCount == 0 &&
      noBridges
    ) {
      this.islandCount =
        Math.floor(Math.random() * this.MIN_ISLAND_SEGMENTS) +
        this.MAX_ISLAND_SEGMENTS;
    }

    this.islands.shift();
    if (this.islandCount > 0) {
      const last = this.islands[this.islands.length - 1];
      const [lastLeft, lastRight] = last ? last : this.map[this.map.length - 1];
      let [left, right] = this.generateBoundaries(
        lastLeft,
        lastRight,
        this.RIVER_CHANGE_CHANCE,
        this.RANDOMNESS_RATIO,
        this.MIN_RIVER_WIDTH,
        this.MAX_RIVER_WIDTH / 3
      );

      const lastMap = this.map[this.map.length - 1];
      if (Math.abs(left - lastMap[0]) < this.MIN_RIVER_WIDTH) {
        lastMap[0] = (left - (50 - this.SHORE_THICKNESS / 2)) / 2;
        left += 5;
      }
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

  private static generateBridges() {
    this.bridges.shift();

    let spawnBridge = false;
    if (Math.random() < this.BRIDGE_SPAWN_CHANCE) spawnBridge = true;

    const firstIslands = this.islands.slice(-10, this.islands.length);
    if (firstIslands.filter((i) => !i).length != firstIslands.length)
      spawnBridge = false;

    const firstBridges = this.bridges.slice(-10, this.bridges.length);
    if (firstBridges.indexOf(true) > -1) spawnBridge = false;

    const firstSegments = this.map.slice(-10, this.map.length);
    if (firstSegments.findIndex(([left, right]) => left > 0 || right < 0) > -1)
      spawnBridge = false;

    if (spawnBridge) {
      this.bridges.push(true);
      this.bridgeSpace = 10;

      firstSegments.forEach((stripe) => {
        stripe[0] = -10 + Math.random();
        stripe[1] = 10 + Math.random();
      });
    } else {
      this.bridges.push(false);
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
      this.generateBridges();
      this.onScrollJump();
    }
  }
}
