document.addEventListener('DOMContentLoaded', function() {
    let exitToken = document.querySelector(".exitToken");
    exitToken.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('exitToken click');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"; 
    });
});
