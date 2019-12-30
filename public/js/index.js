/* eslint-disable */
import axios from 'axios';
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapEl = document.getElementById('map');
const domainEl = document.getElementById('domain');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

let domain = '';
if (domainEl) domain = domainEl.dataset.domain;

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  displayMap(locations);
}

if (loginForm) loginForm.addEventListener('submit', onSubmit);

if (userDataForm) userDataForm.addEventListener('submit', onSubmitUserData);

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', onSubmitUserPassword);

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
    // e.target.textContent = 'Book Tour';
  });

function onSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
}

function onSubmitUserData(e) {
  e.preventDefault();
  document.querySelector('.btn--save-user-data').textContent =
    'Saving settings...';
  const form = new FormData();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const photo = document.getElementById('photo').files[0];

  form.append('name', name);
  form.append('email', email);
  form.append('photo', photo);

  updateSettings(form, 'name, email, and photo');
  document.querySelector('.btn--save-user-data').textContent = 'Save settings';
}

async function onSubmitUserPassword(e) {
  e.preventDefault();
  document.querySelector('.btn--save-password').textContent =
    'Saving password...';
  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  await updateSettings(
    { passwordCurrent, password, passwordConfirm },
    'password'
  );

  // Reset fields
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
  document.querySelector('.btn--save-password').textContent = 'Save password';
}

async function sendClientError() {
  await axios({
    method: 'POST',
    url: `/error`,
    data: { error }
  });
}

// const alertMessage = document.querySelector('body').dataset.alert;

// if (alertMessage) showAlert('success', alertMessage, 20);

export { domain, sendClientError };
