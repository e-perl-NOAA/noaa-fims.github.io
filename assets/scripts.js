// Add 'images/' to the file paths in your preloader array
const preloadedImages = [];
const imageList = [
  'images/fims-user1.png', 
  'images/fims-user2.png', 
];

imageList.forEach(src => {
  const img = new Image();
  img.src = src;
  preloadedImages.push(img);
});

// The swap function stays exactly the same!
function changeImage(newSrc) {
  document.getElementById('fims-main-img').src = newSrc;
}