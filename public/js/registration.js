let passwordInput = document.getElementById("passwordInput");
let confirmPasswordInput = document.getElementById("confirmPasswordInput");
let confirmPasswordError = document.getElementById("confirmPasswordError");
let emailInput = document.getElementById("emailInput");
let loginInput = document.getElementById("loginInput");

function checkingPassword() {
  confirmPasswordInput.addEventListener("input", function () {
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;
    if (password === confirmPassword || confirmPassword === "") {
      confirmPasswordError.style.display = "none";
    } else {
      confirmPasswordError.style.display = "block";
    }
  });
}
checkingPassword();

function checkingExistenceEmail() {
  emailInput.addEventListener("input", async function () {
    let email = emailInput.value;
    try {
      await fetch(`/check-email?email=${email}`);
    } catch (error) {
      console.error(error);
    }
  });
}
checkingExistenceEmail();

function checkingExistenceLogin() {
  loginInput.addEventListener("input", async function () {
    let login = loginInput.value;
    try {
      await fetch(`/check-login?login=${login}`);
    } catch (error) {
      console.error(error);
    }
  });
}
checkingExistenceLogin();

let passwordCheckbox1 = document.getElementById("passwordCheckbox1");
passwordCheckbox1.addEventListener("change", function () {
  togglePasswordVisibility("passwordInput", passwordCheckbox1);
});

let passwordCheckbox2 = document.getElementById("passwordCheckbox2");
passwordCheckbox2.addEventListener("change", function () {
  togglePasswordVisibility("confirmPasswordInput", passwordCheckbox2);
});

function togglePasswordVisibility(inputId, checkbox) {
  let input = document.getElementById(inputId);
  input.type = checkbox.checked ? "text" : "password";
}

function togglePasswordAuthorizVisibility() {
  let passwordInput = document.getElementById("passwordInput");
  let passwordCheckbox = document.getElementById("passwordCheckbox");
  passwordInput.type = passwordCheckbox.checked ? "text" : "password";
}
