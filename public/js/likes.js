document.addEventListener("DOMContentLoaded", function () {
  let likes = document.querySelectorAll(".likeBtnContent");

  for (let i = 0; i < likes.length; i++) {
    likes[i].addEventListener("click", function () {
      let recipeId = this.dataset.id;
      let formData = new FormData();
      formData.append("recipeId", recipeId);
      fetch(`/home/likes`, {
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
          let pLikeContainer = this.closest(".like").querySelector(".pLike");
          pLikeContainer.innerHTML = text;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
  }
});
