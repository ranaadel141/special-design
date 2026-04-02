// check if there is local storage color option
let mainColors = localStorage.getItem("color_option");
if (mainColors !== null) {
  //set color on root
  document.documentElement.style.setProperty("--primary-color", mainColors);
  //check for active class
  document.querySelectorAll(".colors-list li").forEach((element) => {
    element.classList.remove("active");
    //add active class on element with data-color === local storage item
    if (element.dataset.color === mainColors) {
      //add active class
      element.classList.add("active");
    }
  });
}

//toggle spin class on gear
document.querySelector(".toggle-setting .fa-gear").onclick = function () {
  this.classList.toggle("fa-spin");
  //toggle open class on setting box
  document.querySelector(".setting-box").classList.toggle("open");
};
//switch colors
const colorsLi = document.querySelectorAll(".colors-list li");
// console.log(colorsLi);
colorsLi.forEach((li) => {
  li.addEventListener("click", (e) => {
    //set color on root
    document.documentElement.style.setProperty(
      "--primary-color",
      e.target.dataset.color,
    );

    localStorage.setItem("color_option", e.target.dataset.color);
    //remove active class from all li
    //     e.target.parentElement.querySelectorAll('.active').forEach(element => {
    //         element.classList.remove('active');
    //     });
    //     //add active class to clicked li
    //     e.target.classList.add('active');
    handleActive(e);
  });
});
//switch random background option
const randomBackEl = document.querySelectorAll(".random-backgrounds span");
// loop on all spans
randomBackEl.forEach((span) => {
  //click on every span
  span.addEventListener("click", (e) => {
    handleActive(e);

    if (e.target.dataset.background === "yes") {
      backgroundOption = true;
      randomizeImages();
      localStorage.setItem("background_option", true);
    } else {
      backgroundOption = false;
      clearInterval(backgroundInterval);
      localStorage.setItem("background_option", false);
    }
  });
});

//Select landing page elements
let landingPage = document.querySelector(".landing-page");

//Get array of images
let imagesArray = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

// random background option
let backgroundOption = true;

//varibale to control the background interval
let backgroundInterval;

// cheeck if there is local storage random background item
let backgroundLocalItem = localStorage.getItem("background_option");
if (backgroundLocalItem !== null) {
  console.log(backgroundLocalItem);
  if (backgroundLocalItem === "true") {
    backgroundOption = true;
    document.querySelector(".random-backgrounds .Yes").classList.add("active");
    document
      .querySelector(".random-backgrounds .No")
      .classList.remove("active");
  } else {
    backgroundOption = false;
    document.querySelector(".random-backgrounds .No").classList.add("active");
    document
      .querySelector(".random-backgrounds .Yes")
      .classList.remove("active");
  }
}

//function to randomize background
function randomizeImages() {
  backgroundInterval = setInterval(() => {
    if (backgroundOption === true) {
      //get random number based on images array length
      let randomNumber = Math.floor(Math.random() * imagesArray.length);
      //change background image url
      landingPage.style.backgroundImage =
        'url("imgs/' + imagesArray[randomNumber] + '")';
    }
  }, 1000);
}

randomizeImages();

// select skills selector
let ourSkills = document.querySelector(".skills");
window.onscroll = function () {
  //skills offset top
  let skillsOffsetTop = ourSkills.offsetTop; // dynamic
  // console.log(skillsOffsetTop);
  //window height
  let windowHeight = this.innerHeight; // dynamic
  // console.log(windowHeight);
  //window scroll top
  let windowScrollTop = this.pageYOffset; // dynamic

  if (windowScrollTop + windowHeight >= skillsOffsetTop) {
    let allSkills = document.querySelectorAll(
      ".skill-box .Skill-progress span",
    );
    allSkills.forEach((skill) => {
      skill.style.width = skill.dataset.progress;
    });
  }
};

//create popup with the image
let ourGallery = document.querySelectorAll(".gallery img");
ourGallery.forEach((img) => {
  img.addEventListener("click", (e) => {
    //create overlay element
    let overlay = document.createElement("div");
    //add class to overlay
    overlay.className = "popup-overlay";
    //append overlay to the body
    document.body.appendChild(overlay);
    //create the popup box
    let popupBox = document.createElement("div");
    //add class to popup box
    popupBox.className = "popup-box";
    if (img.alt !== null) {
      //create heading
      let imgHeading = document.createElement("h3");
      //create text for heading
      let imgText = document.createTextNode(img.alt);
      //append the text to heading
      imgHeading.appendChild(imgText);
      //add the heading to popup box
      popupBox.appendChild(imgHeading);
    }
    //create the image
    let popupImage = document.createElement("img");
    //set the image source
    popupImage.src = img.src;
    //add image to popup box
    popupBox.appendChild(popupImage);
    //add the popup box to body
    document.body.appendChild(popupBox);
    //create the close span
    let closeButton = document.createElement("span");
    //create the close button text
    let closeButtonText = document.createTextNode("X");
    //append text to close button
    closeButton.appendChild(closeButtonText);
    //add class to close button
    closeButton.className = "close-button";
    //add close button to popup box
    popupBox.appendChild(closeButton);
  });
});

//close popup
document.addEventListener("click", (e) => {
  if (e.target.className == "close-button") {
    //remove the current popup
    e.target.parentNode.remove();

    //remove overlay
    document.querySelector(".popup-overlay").remove();
  }
});

//selcet all bullets
const allBullets = document.querySelectorAll(".nav-bollets .bullet");
//selcet all links
const allLinks = document.querySelectorAll(".links a");

function scrollToSomewhere(elements) {
  elements.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(e.target.dataset.section).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}
scrollToSomewhere(allBullets);
scrollToSomewhere(allLinks);

// handle active state
function handleActive(ev) {
  ev.target.parentElement.querySelectorAll(".active").forEach((element) => {
    element.classList.remove("active");
  });
  ev.target.classList.add("active");
}

let bulletsSpan = document.querySelectorAll(".bullet-option span");
let bulletsContainer = document.querySelector(".nav-bollets");
let bulletsLocalItem = localStorage.getItem("bullets_option");
if (bulletsLocalItem !== null) {
  bulletsSpan.forEach((span) => {
    span.classList.remove("active");
  });

  if (bulletsLocalItem === "show") {
    bulletsContainer.style.display = "block";
    document.querySelector(".bullet-option .Yes").classList.add("active");
  } else {
    bulletsContainer.style.display = "none";
    document.querySelector(".bullet-option .No").classList.add("active");
  }
}

bulletsSpan.forEach((span) => {
  span.addEventListener("click", (e) => {
    if (span.dataset.bullet === "show") {
      bulletsContainer.style.display = "block";
      localStorage.setItem("bullets_option", "show");
    } else {
      bulletsContainer.style.display = "none";
      localStorage.setItem("bullets_option", "رنا جعانه");
    }
    handleActive(e);
  });
});

//reset button
document.querySelector(".reset-option").onclick = function () {
  //clear local storage
  //   localStorage.clear();
  localStorage.removeItem("color_option");
  localStorage.removeItem("background_option");
  localStorage.removeItem("bullets_option");

  //reload window
  window.location.reload();
};
//toggle menu
let toggleBtn = document.querySelector(".toggle-menu");
let tLinks = document.querySelector(".links");