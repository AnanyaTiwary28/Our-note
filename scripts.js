const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');

// Show registration form and hide login form when 'register-link' is clicked
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
    wrapper.querySelector('.form-box.login').style.transform = "translateX(-400px)";
    wrapper.querySelector('.form-box.register').style.transform = "translateX(0)";
});

// Show login form and hide registration form when 'login-link' is clicked
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
    wrapper.querySelector('.form-box.login').style.transform = "translateX(0)";
    wrapper.querySelector('.form-box.register').style.transform = "translateX(400px)";
});

// Show popup when login button is clicked
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

// Hide popup when the close icon is clicked
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});
