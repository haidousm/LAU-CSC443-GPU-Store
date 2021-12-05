const ROOT_URL = "";
const AUTH_URL = `${ROOT_URL}/auth`;
const ACCOUNT_URL = `${ROOT_URL}/account`;

let registerButton = document.getElementById("register-button");
let loginButton = document.getElementById("login-button");

if (registerButton) {
    let firstNameField = document.getElementById("firstName");
    let lastNameField = document.getElementById("lastName");
    let emailField = document.getElementById("email");
    let passwordField = document.getElementById("password");

    registerButton.addEventListener("click", async () => {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstNameField.value,
                lastName: lastNameField.value,
                email: emailField.value,
                password: passwordField.value,
            }),
        });
        if (response.status === 200) {
            window.location.href = "/account";
        }
    });
}

if (loginButton) {
    let loginEmailField = document.getElementById("loginEmail");
    let loginPasswordField = document.getElementById("loginPassword");
    loginButton.addEventListener("click", async () => {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: loginEmailField.value,
                password: loginPasswordField.value,
            }),
        });
        if (response.status === 200) {
            window.location.href = "/account";
        }
    });
}

const modalTriggers = document.querySelectorAll(".popup-trigger");
const modalCloseTrigger = document.querySelector(".popup-modal__close");
const bodyBlackout = document.querySelector(".body-blackout");

if (modalTriggers.length > 0) {
    modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", async () => {
            const { popupTrigger } = trigger.dataset;
            const popupModal = document.querySelector(
                `[data-popup-modal="${popupTrigger}"]`
            );
            popupModal.classList.add("is--visible");
            bodyBlackout.classList.add("is-blacked-out");

            popupModal
                .querySelector(".popup-modal__close")
                .addEventListener("click", () => {
                    popupModal.classList.remove("is--visible");
                    bodyBlackout.classList.remove("is-blacked-out");
                });
        });
        return;
    });

    (async () => {
        const countrySelector = document.getElementById("country");
        const countries = await (
            await fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
        ).json();

        countries.sort((a, b) => {
            if (a.name.common < b.name.common) {
                return -1;
            }
            if (a.name.common > b.name.common) {
                return 1;
            }
            return 0;
        });
        countries.forEach((country) => {
            const option = document.createElement("option");
            option.value = country.cca2;
            option.innerText = country.name.common;
            countrySelector.appendChild(option);
        });
    })();
}

let saveAddressButton = document.getElementById("add-address-submit");
let streetField = document.getElementById("street");
let cityField = document.getElementById("city");
let zipField = document.getElementById("zip");
let countrySelect = document.getElementById("country");
let primaryAddressCheckbox = document.getElementById("primary");
let addAddressButton = document.getElementById("add-address-button");
if (saveAddressButton) {
    saveAddressButton.addEventListener("click", async () => {
        let response;
        if (saveAddressButton.dataset.id) {
            response = await fetch(`${ACCOUNT_URL}/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: saveAddressButton.dataset.id,
                    street: streetField.value,
                    city: cityField.value,
                    zip: zipField.value,
                    country: countrySelect.value,
                    isPrimary: primaryAddressCheckbox.checked,
                }),
            });
        } else {
            response = await fetch(`${ACCOUNT_URL}/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    street: streetField.value,
                    city: cityField.value,
                    zip: zipField.value,
                    country: countrySelect.value,
                    isPrimary: primaryAddressCheckbox.checked,
                }),
            });
        }
        if (response.status === 200) {
            window.location.href = "/account";
        }
    });
}

let deleteAddressButtons = document.querySelectorAll(".delete-address-button");
let editAddressButtons = document.querySelectorAll(".edit-address-button");

if (deleteAddressButtons) {
    deleteAddressButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const response = await fetch(
                `${ROOT_URL}/account/addresses/${button.dataset.id}`,
                { method: "DELETE" }
            );
            if (response.status === 200) {
                window.location.href = "/account";
            }
        });
    });
}

if (editAddressButtons) {
    editAddressButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const address = await (
                await fetch(
                    `${ROOT_URL}/account/addresses/${button.dataset.id}`
                )
            ).json();
            streetField.value = address.street;
            cityField.value = address.city;
            zipField.value = address.zip;
            countrySelect.value = address.country;
            primaryAddressCheckbox.checked = address.isPrimary;
            saveAddressButton.dataset.id = address.id;
            addAddressButton.click();
        });
    });
}
