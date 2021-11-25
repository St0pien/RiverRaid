import RiverRaid from './components/RiverRaid';
import './css/main.css';

new RiverRaid().start();

addEventListener('keypress', e => {
  if (e.code == 'Space') debugger;
});
