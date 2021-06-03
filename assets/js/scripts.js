let currentImage = 0,
  menu_item = document.querySelectorAll(".link-items span"),
  images = document.querySelectorAll(".slider img"),
  imagesLength = images.length,
  dot = document.querySelectorAll(".circle"),
  slider_options = document.querySelector(".slider"),
  time = slider_options.getAttribute("time")
    ? slider_options.getAttribute("time")
    : 5000;

function nextImage(index) {
  activeContent();
}

function activeContent() {
  dot[currentImage].classList.remove("active");
  images[currentImage].classList.remove("active");
  currentImage++;
  if (currentImage == imagesLength) {
    currentImage = 0;
  }

  images[currentImage].classList.add("active");
  dot[currentImage].classList.add("active");
}

function start() {
  setInterval(() => {
    nextImage();
  }, time);
}

window.addEventListener("load", start);

menu_item.forEach((value, index) => {
  value.addEventListener("click", () => {
    item(index);
  });
});

function item(elem) {
  menu_item.forEach((value, index) => {
    if (elem == index) {
      value.classList.add("active");
    } else {
      value.classList.remove("active");
    }
  });
}


let trx=JSON.parse(localStorage.getItem('user'));
var profilePicture = document.createElement("img"); 
profilePicture.src = trx.Image;
profilePicture.style.width='100%';
profilePicture.style.width='100%';
profilePicture.style.borderRadius='100%';
document.querySelector('.user-picture').appendChild(profilePicture);    
