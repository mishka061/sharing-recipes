document.addEventListener("DOMContentLoaded", function () {
  let categorySearch = document.querySelectorAll(".categorySearch");
  let categoryContent = document.querySelector(".categoryContent");
  let homeContent = document.querySelector("#homeContent");
  let pagination = document.querySelector(".pagination");
  let arr = {
    meat: "Мясо",
    bird: "Птица",
    fish: "Рыба",
    soups: "Супы",
    porridge: "Каши",
    salads: "Салаты",
    vegetables: "Овощи",
    bakery: "Выпечка",
  };
  for (let i = 0; i < categorySearch.length; i++) {
    categorySearch[i].addEventListener("click", function () {
      let categoryElem = categorySearch[i].dataset.category;
      let formData = new FormData();
      formData.append("category", categoryElem);
      fetch(`/home/${categoryElem}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          homeContent.remove();
          pagination.remove();
          document.title = "Категория - " + arr[categoryElem];
          categoryContent.innerHTML = text;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
  }
});
