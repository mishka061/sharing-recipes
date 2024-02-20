document.addEventListener("DOMContentLoaded", function () {
  let categoryContent = document.querySelector(".categoryContent");
  let homeContent = document.querySelector("#homeContent");
  let pagination = document.querySelector(".pagination");
  let contentMainMenu = document.querySelector(".contentMainMenu");

  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("fullCategoryDescription")) {
      let elemId = event.target.dataset.id;
      fetch(`/home/${elemId}`, {
        method: "POST",
        body: JSON.stringify({ elemId: elemId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          categoryContent.innerHTML = text;
          pagination.style.display = " none";
          homeContent.remove();
          contentMainMenu.remove();
          let textCommentBtn = document.querySelector(".textCommentBtn");
          let commentForm = document.querySelector(".commentForm");
          textCommentBtn.addEventListener("click", function () {
            commentForm.style.display = " block";
            textCommentBtn.style.display = " none";
          });
          let textAreaSubmit = document.querySelector(".textAreaSubmit");
          let textAreaCommit = document.querySelector(".textAreaCommit");
          let commentAdd = document.querySelector(".commentAdd");
          textAreaSubmit.addEventListener("click", function () {
            let comments = textAreaCommit.value;
            let formData = new FormData();
            formData.append("id", elemId);
            formData.append("comments", textAreaCommit.value);
            let fileInput = document.querySelector(".recipes-form-image");
            if (fileInput.files.length > 0) {
              for (let i = 0; i < fileInput.files.length; i++) {
                let file = fileInput.files[i];
                formData.append("image", file);
                let imagePath = file.name;
                formData.append("imagePath", imagePath);
              }
            } else {
              console.log("No files are selected");
            }
            fetch(`/home/${comments}`, {
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
                commentForm.style.display = " none";
                textCommentBtn.style.display = " block";
                commentAdd.innerHTML = text;
              })
              .catch((error) => {
                console.error("Fetch error:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
});
