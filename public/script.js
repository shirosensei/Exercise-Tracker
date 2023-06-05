// var images = [
//     'image1.jpg', 
//     'image2.jpg',
//     'image3.jpg',
//     'image4.png',
//     'image5.jpg'
  
//   ];
// var index = 0;
// var slideshowImage = document.querySelector('.slideshow-image');

// function changeBackground() {
//   slideshowImage.style.backgroundImage = `url('${images[index]}')`;
//   index = (index + 1) % images.length;
// }

// setInterval(changeBackground, 2000);

let hamburger = document.querySelector('.hamburger');
let navLinks = document.getElementById('nav-links');
let links = document.querySelectorAll('.links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('hide');
  hamburger.classList.toggle('line-rotate')
})

for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', () => {
    navLinks.classList.toggle('hide');
  });
}