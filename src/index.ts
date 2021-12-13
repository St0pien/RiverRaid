import RiverRaid from './components/RiverRaid';
import './css/main.css';

document.querySelector('button').addEventListener('click', () => {
  (document.querySelector('.start') as HTMLElement).style.display = 'none';
  new RiverRaid().start();
});
