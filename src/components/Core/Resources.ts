import planeimg from '../../assets/sprites/plane.png';

export enum Colors {
  side = 'green',
  water = 'blue',
  shore = '#332100',
  street1 = '#444',
  street2 = 'gray',
  street3 = 'yellow'
}

export const PlaneSprite = new Image();
PlaneSprite.src = planeimg;
