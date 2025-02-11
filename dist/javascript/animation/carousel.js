document.addEventListener("DOMContentLoaded", () => {
  // Function to initialize a continuous carousel
  function initializeCarousel(carouselId) {
      const carousel = document.getElementById(carouselId);
      const items = carousel.children;
      const itemWidth = items[0].offsetWidth;
      let currentIndex = 0;
      const totalItems = items.length;

      // Duplicate the first item at the end to create seamless scrolling
      const clone = items[0].cloneNode(true);
      carousel.appendChild(clone);

      // Start the continuous scroll
      function scrollCarousel() {
          currentIndex++;
          carousel.style.transition = "transform 0.5s ease-in-out";
          carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

          // Reset to the first item without transition when reaching the clone
          if (currentIndex >= totalItems) {
              setTimeout(() => {
                  carousel.style.transition = "none"; // Disable transition
                  carousel.style.transform = "translateX(0px)"; // Reset position
                  currentIndex = 0; // Reset index
              }, 500); // Match the transition duration
          }
      }

      // Set interval for the carousel scroll
      setInterval(scrollCarousel, 3000); // Adjust interval time as needed
  }

  // Initialize all carousels
  const carouselIds = ["carousel1", "carousel2", "carousel3", "carousel4", "carousel5", "carousel6"];
  carouselIds.forEach((id) => initializeCarousel(id));
});
