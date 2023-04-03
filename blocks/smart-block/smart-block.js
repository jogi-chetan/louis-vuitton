export default function decorate(block) {
  //
  [...block.children].forEach((row) => {
    row.classList.add('row');
    [...row.children].forEach((cell) => {
      cell.classList.add('cell');
    });
  });

  // Create carousel container and append it to the existing block
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel');
  block.appendChild(carouselContainer);

  // Add left arrow
  const leftArrow = document.createElement('button');
  leftArrow.classList.add('arrow', 'arrow--left');
  leftArrow.innerHTML = '<i class="arrow-icon">←</i>';
  carouselContainer.appendChild(leftArrow);

  // Add right arrow
  const rightArrow = document.createElement('button');
  rightArrow.classList.add('arrow', 'arrow--right');
  rightArrow.innerHTML = '<i class="arrow-icon">→</i>';
  carouselContainer.appendChild(rightArrow);

  // Add pagination
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  carouselContainer.appendChild(pagination);

  // Calculate number of pages
  const rows = block.querySelectorAll('.row');
  const numPages = Math.ceil(rows.length);

  // Add dots to pagination
  for (let i = 0; i < numPages; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) {
      dot.classList.add('active');
    }
    pagination.appendChild(dot);
  }

  // Add event listeners to arrows
  let currentPage = 0;
  leftArrow.addEventListener('click', () => {
    currentPage = Math.max(currentPage - 1, 0);
    carouselContainer.style.transform = `translateX(-${currentPage * 100}%)`;
    updatePagination();
  });

  rightArrow.addEventListener('click', () => {
    currentPage = Math.min(currentPage + 1, numPages - 1);
    carouselContainer.style.transform = `translateX(-${currentPage * 100}%)`;
    updatePagination();
  });

  // Update active dot in pagination
  function updatePagination() {
    const dots = pagination.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}
