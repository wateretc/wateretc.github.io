document.addEventListener("DOMContentLoaded", function() {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slideshow img");

  document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
      showSlide(-1);
    } else if (e.key === "ArrowRight") {
      showSlide(1);
    }
  });

  function showSlide(n) {
    currentSlide += n;
    if (currentSlide >= slides.length) {
      currentSlide = 0;
    } else if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    slides[currentSlide].style.display = "block";
  }
});
