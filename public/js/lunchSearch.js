document.addEventListener("DOMContentLoaded", function () {
  let lunch = document.querySelectorAll("#lunchContent");
  let categoryContent = document.querySelector(".categoryContent");

  let arr = {
    breakfast: "Завтрак",
    lunch: "Обед",
    supper: "Ужин",
    snack: "Перекус",
  };

  for (let i = 0; i < lunch.length; i++) {
    lunch[i].addEventListener("click", function () {
      let dataLunch = lunch[i].dataset.lunch;
      console.log("dataLunch", dataLunch);

      let formData = new FormData();
      formData.append("lunch", dataLunch);

      fetch(`/home/lunch`, {
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
          categoryContent.innerHTML = text;
          document.title = "Категория - " + arr[dataLunch];
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
  }
});
