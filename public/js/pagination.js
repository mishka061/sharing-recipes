let pagination = document.querySelector(".pagination");
let containerAddPhoto = document.querySelectorAll(".elementIngridient");
let allTestArr = 10;
let currentPage = 1;

function createPaginationBtn(pageNumber) {
  let button = document.createElement("button");
  button.classList.add("page-link");
  button.textContent = pageNumber;

  button.addEventListener("click", function () {
    currentPage = pageNumber;
    updateVisibly();
    updateActiveClass(); 
  });
  pagination.appendChild(button);
}

function updateVisibly() {
  for (let i = 0; i < containerAddPhoto.length; i++) {
    if (i < (currentPage - 1) * allTestArr || i >= currentPage * allTestArr) {
      containerAddPhoto[i].style.display = "none";
    } else {
      containerAddPhoto[i].style.display = "block";
    }
  }
}
function updateActiveClass() {
  let buttons = document.querySelectorAll(".page-link");
  buttons.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
for (let i = 0; i < containerAddPhoto.length; i++) {
  if (i % allTestArr === 0) {
    createPaginationBtn(i / allTestArr + 1);
  }
}
updateActiveClass();
updateVisibly();
