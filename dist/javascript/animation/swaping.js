document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("#imageContainer1 img");
    let currentIndex = 0;

    function showNextImage() {
        // Hide the current image
        images[currentIndex].classList.remove("opacity-100", "scale-100");
        images[currentIndex].classList.add("opacity-0", "scale-50");

        // Update the index to the next image
        currentIndex = (currentIndex + 1) % images.length;

        // Show the next image with transition
        images[currentIndex].classList.remove("opacity-0", "scale-50");
        images[currentIndex].classList.add("opacity-100", "scale-100");
    }

    // Start the image transition every 3 seconds
    setInterval(showNextImage, 3000);
});
