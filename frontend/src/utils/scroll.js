export const scrollLeft = (sectionId) => {
    const container = document.getElementById(sectionId).parentElement;
    container.scrollLeft -= 300 * 5;
    updateScrollButtons(sectionId);
  };
  
  export const scrollRight = (sectionId) => {
    const container = document.getElementById(sectionId).parentElement;
    container.scrollLeft += 300 * 5;
    updateScrollButtons(sectionId);
  };
  
  export const updateScrollButtons = (sectionId) => {
    const container = document.getElementById(sectionId).parentElement;
    const leftButton = container.querySelector('.scroll-button.left');
    const rightButton = container.querySelector('.scroll-button.right');
  
    if (leftButton) {
      leftButton.style.display = container.scrollLeft > 0 ? 'block' : 'none';
    }
  
    if (rightButton) {
      rightButton.style.display =
        container.scrollLeft + container.clientWidth < container.scrollWidth
          ? 'block'
          : 'none';
    }
  };
  
  export const handleScroll = (sectionId) => {
    updateScrollButtons(sectionId);
  };