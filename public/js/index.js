/* eslint-disable */
import axios from 'axios';
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapEl = document.getElementById('map');
const domainEl = document.getElementById('domain');
const form = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');

let domain = '';
if (domainEl) domain = domainEl.dataset.domain;

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  displayMap(locations);
}

if (form && domain) form.addEventListener('submit', onSubmit);

if (userDataForm && domain)
  userDataForm.addEventListener('submit', onSubmitUserData);

if (userPasswordForm && domain)
  userPasswordForm.addEventListener('submit', onSubmitUserPassword);

if (logOutBtn) logOutBtn.addEventListener('click', logout);

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
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateSettings({ name, email }, 'name and email');
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
    url: `${domain}/error`,
    data: { error }
  });
}

export { domain, sendClientError };
