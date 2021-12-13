import planeimg from '../../assets/sprites/plane.png';
import bridgeimg from '../../assets/sprites/bridge.png';
import shipimg from '../../assets/sprites/ship.png';
import chopperimg from '../../assets/sprites/chopper.png';
import baloonimg from '../../assets/sprites/baloon.png';
import jetimg from '../../assets/sprites/enemy-plane.png';
import fuelimg from '../../assets/sprites/fuel.png';
import statsimg from '../../assets/sprites/stats.png';

export enum Colors {
  side = 'green',
  water = 'blue',
  shore = '#332100',
  street1 = '#444',
  street2 = 'gray',
  street3 = 'yellow',
  fuel = 'yellow'
}

export const PlaneSprite = new Image();
PlaneSprite.src = planeimg;

export const BridgeSprite = new Image();
BridgeSprite.src = bridgeimg;

export const ShipSprite = new Image();
ShipSprite.src = shipimg;

export const ChopperSprite = new Image();
ChopperSprite.src = chopperimg;

export const BaloonSprite = new Image();
BaloonSprite.src = baloonimg;

export const JetSprite = new Image();
JetSprite.src = jetimg;

export const FuelSprite = new Image();
FuelSprite.src = fuelimg;

export const StatsSprite = new Image();
StatsSprite.src = statsimg;
