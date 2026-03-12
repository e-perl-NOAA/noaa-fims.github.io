// The preloader stays exactly the same
const preloadedImages = [];
const imageList = ['images/fims-user1.png', 'images/fims-user2.png'];

imageList.forEach(src => {
  const img = new Image();
  img.src = src;
  preloadedImages.push(img);
});

// UPGRADED SWAP FUNCTION
function changeImage(newSrc, newAltText) {
  const mainImage = document.getElementById('fims-main-img');
  
  // 1. Swap the picture
  mainImage.src = newSrc;
  
  // 2. Swap the alt text for screen readers!
  mainImage.alt = newAltText; 
}
