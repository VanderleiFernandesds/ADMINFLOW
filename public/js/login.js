const API_URL = 'http://localhost:3000/auth';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

const toast = document.getElementById('toast');

showRegisterBtn.addEventListener('click', () => {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

showLoginBtn.addEventListener('click', () => {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    showToast('Conta criada com sucesso');

    registerForm.reset();

    registerForm.classList.remove('active');
    loginForm.classList.add('active');
  } catch (error) {
    showToast(error.message);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = 'index.html';
  } catch (error) {
    showToast(error.message);
  }
});

function showToast(message) {
  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
