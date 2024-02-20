document.addEventListener("DOMContentLoaded", function () {
  console.log("home");
  let plusButtons = document.querySelectorAll(".plus");
  let minusButtons = document.querySelectorAll(".minus");

  plusButtons.forEach((plusButton) => {
    plusButton.addEventListener("click", function () {
      plusButton.previousElementSibling.value++;
      let servings = plusButton.previousElementSibling.value;
      let numberElement = plusButton.parentElement
        .closest(".recipesIdelementIngridient")
        .querySelectorAll(".number");
      numberElement.forEach((numberElem) => {
        let sum = numberElem.value / servings;
        numberElem.value = (Number(numberElem.value) + sum).toFixed(1);
      });
    });
  });

  minusButtons.forEach((minusButton) => {
    minusButton.addEventListener("click", function () {
      let servings =
        minusButton.previousElementSibling.previousElementSibling.value;
      let numberElement = minusButton.parentElement
        .closest(".recipesIdelementIngridient")
        .querySelectorAll(".number");
      if (
        minusButton.previousElementSibling.previousElementSibling.value >= 1
      ) {
        numberElement.forEach((numberElem) => {
          let sum = numberElem.value / servings;
          numberElem.value = (Number(numberElem.value) - sum).toFixed(1);
        });
        minusButton.previousElementSibling.previousElementSibling.value--;
      }
    });
  });
});
