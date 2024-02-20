document.addEventListener("DOMContentLoaded", function () {
  let removeIngtidients = document.querySelector(".removeIngtidients");
  let btnEditIngridient = document.querySelector(".btnEditIngridient");
  let recipesIngridients = document.querySelector(".recipesIngridients");

  removeIngtidients.addEventListener("click", function (event) {
    event.preventDefault();
    btnEditIngridient.style.display = "block";
    recipesIngridients.remove();
    removeIngtidients.style.display = "none";
  });
  let contentBodyRecies = document.querySelector(".contentBodyRecies");
  let count = 0;
  btnEditIngridient.addEventListener("click", async function (event) {
    event.preventDefault();
    count++;
    let div = document.createElement("div");
    div.setAttribute("class", "divSelect");
    div.innerHTML = `
      <div class="ingridientsConteinerBtn">
        <h6 name="ingridients[${count}][name]" class="titleIngridient">Ингредиент № ${count}</h6>
        <input type="text" list="ingridients[${count}][name]" name="ingridients[${count}][name]" id="ingredientSelect">
        <datalist id="ingridients[${count}][name]"></datalist>
        <div class="contentNumber">
            <div class="numberSelect">
              <p>Единица измерения</p>
              <select name="ingridients[${count}][measurement]" id="measurement" value="Кол-во">
                  <option>Грамм</option>
                  <option>Килограмм</option>
                  <option>Литр</option>
                  <option>Миллилитр</option>
                  <option>Шт</option>
                  <option>Стакан</option>
                  <option>Ст. ложки</option>
                  <option>Чайной ложки</option>
                  <option>Щепотки</option>
                  <option>Капли</option>
                  <option>Часть</option>
                  <option>По вкусу</option>
                  <option>Ломтик</option>
                  <option>Пучок</option>
                  <option>Банка</option>
                  <option>На 100 грамм</option>
              </select>
            </div>
            <div class="numberInput">
                <p>Колличество</p>
                <input type="number" name="ingridients[${count}][number]">
            </div>
        </div>
      </div>
       `;

    let input = div.querySelector("input");
    let datalist = div.querySelector("datalist");

    input.addEventListener("input", async () => {
      try {
        const response = await fetch("/api/ingredients");
        const ingredients = await response.json();
        datalist.innerHTML = "";
        const filteredIngredients = ingredients.filter((ingredient) =>
          ingredient.name.toLowerCase().includes(input.value.toLowerCase())
        );
        filteredIngredients.forEach((ingredient) => {
          let option = document.createElement("option");
          option.value = ingredient.name;
          option.text = ingredient.name;
          console.log("Adding option:", option.value);
          datalist.appendChild(option);
        });
      } catch (error) {
        console.error( error);
      }
    });
    contentBodyRecies.appendChild(div);
  });
});
