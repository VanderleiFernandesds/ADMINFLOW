import { createUser, deleteUser, fetchUsers, updateUser } from './api/usersApi.js';
import { closeModal, openModal } from './ui/modal.js';
import { renderPagination } from './ui/pagination.js';
import { renderUsersTable } from './ui/table.js';
import { showToast } from './ui/toast.js';
import { authFetch } from './utils/auth.js';
import { getCurrentUser } from './utils/user.js';

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html';
}

const currentUser = getCurrentUser();

const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

if (!currentUser || currentUser.role !== 1) {
  const adminMenu = document.getElementById('adminMenu');

  if (adminMenu) {
    adminMenu.remove();
  }
}

const DASHBOARD_URL =
  window.location.protocol === 'file:'
    ? 'http://localhost:3000/dashboard/stats'
    : '/dashboard/stats';

const totalUsersCard = document.getElementById('totalUsers');
const activeUsersCard = document.getElementById('activeUsers');
const inactiveUsersCard = document.getElementById('inactiveUsers');

let currentPage = 1;
let totalPages = 1;
let editingUserId = null;
let userToDelete = null;
let usersData = [];

const searchInput = document.getElementById('searchInput');
const userTableBody = document.getElementById('userTableBody');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleIdInput = document.getElementById('roleId');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveButton = userForm.querySelector('button[type="submit"]');
const deleteMessage = document.getElementById('deleteMessage');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const toast = document.getElementById('toast');
const loading = document.getElementById('loading');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
async function loadUsers() {
  try {
    loading.style.display = 'block';

    const data = await fetchUsers(currentPage);

    usersData = data.users || [];
    totalPages = data.totalPages || 1;
    currentPage = data.page || currentPage;

    renderUsersTable(userTableBody, usersData, currentUser);
    renderPagination({ currentPage, totalPages, pageInfo, prevPageBtn, nextPageBtn });
  } catch (error) {
    showToast(toast, error.message);
  } finally {
    loading.style.display = 'none';
  }
}

async function loadDashboardStats() {
  try {
    const response = await authFetch(DASHBOARD_URL);

    if (!response.ok) {
      throw new Error('Erro ao carregar métricas');
    }

    const stats = await response.json();

    totalUsersCard.textContent = stats.totalUsers;
    activeUsersCard.textContent = stats.activeUsers;
    inactiveUsersCard.textContent = stats.inactiveUsers;
  } catch (error) {
    showToast(toast, error.message);
  }
}

function resetUserForm() {
  editingUserId = null;
  userForm.reset();
  saveButton.disabled = false;
  saveButton.textContent = 'Salvar';
}

function closeUserModal() {
  closeModal(userModal);
  resetUserForm();
}

function openDeleteModal(user) {
  userToDelete = user.id;
  deleteMessage.textContent = `Deseja realmente excluir ${user.name}?`;
  openModal(deleteModal);
}

function closeDeleteModal() {
  userToDelete = null;
  closeModal(deleteModal);
}

openModalBtn.addEventListener('click', () => {
  resetUserForm();
  openModal(userModal);
});

closeModalBtn.addEventListener('click', closeUserModal);

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleIdInput.value.trim() || 'customer';

  if (!name || !email) {
    showToast(toast, 'Preencha nome e email');
    return;
  }

  try {
    saveButton.disabled = true;
    saveButton.textContent = 'Salvando...';

    const payload = {
      name,
      email,
      role,
      status: 'active',
    };

    if (editingUserId) {
      await updateUser(editingUserId, payload);
    } else {
      await createUser(payload);
    }

    showToast(
      toast,
      editingUserId ? 'Usuário atualizado com sucesso' : 'Usuário criado com sucesso'
    );

    closeUserModal();
    loadUsers();
  } catch (error) {
    showToast(toast, error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Salvar';
  }
});

document.addEventListener('click', (event) => {
  const button = event.target;
  const id = button.dataset.id;

  if (button.classList.contains('edit-btn')) {
    const user = usersData.find((item) => item.id == id);

    if (!user) return;

    editingUserId = id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    roleIdInput.value = user.role || '';

    openModal(userModal);
  }

  if (button.classList.contains('delete-btn')) {
    const user = usersData.find((item) => item.id == id);

    if (user) {
      openDeleteModal(user);
    }
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!userToDelete) return;

  try {
    await deleteUser(userToDelete);

    showToast(toast, 'Usuário desativado com sucesso');
    closeDeleteModal();
    loadUsers();
  } catch (error) {
    showToast(toast, error.message);
  }
});

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredUsers = usersData.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  renderUsersTable(userTableBody, filteredUsers, currentUser);
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadUsers();
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadUsers();
  }
});

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  window.location.href = 'login.html';
});

loadUsers();
loadDashboardStats();
