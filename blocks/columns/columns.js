import { linkPicture } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  block.querySelectorAll('picture').forEach((picture) => {
    linkPicture(picture);
  });
}
