const API_URL = 'http://localhost:3000/users';

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

    const response = await fetch(`${API_URL}?page=${currentPage}`);

    if (!response.ok) {
      throw new Error('Erro ao carregar usuários');
    }

    const data = await response.json();
    const responseUsers = Array.isArray(data) ? data : data.users;

    usersData = responseUsers || [];
    totalPages = data.totalPages || 1;

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    renderUsers(usersData);
  } catch (error) {
    showToast(error.message);
  } finally {
    loading.style.display = 'none';
  }
}

function renderUsers(users) {
  userTableBody.innerHTML = '';

  if (users.length === 0) {
    userTableBody.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum usuário encontrado
        </td>
      </tr>
    `;

    return;
  }

  users.forEach((user) => {
    userTableBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">
            Editar
          </button>

          <button class="delete-btn" data-id="${user.id}">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

function openUserModal() {
  userModal.style.display = 'flex';
}

function closeUserModal() {
  userModal.style.display = 'none';

  editingUserId = null;

  userForm.reset();

  saveButton.disabled = false;
  saveButton.textContent = 'Salvar';
}

function openDeleteModal(user) {
  userToDelete = user.id;

  deleteMessage.textContent = `Deseja realmente excluir ${user.name}?`;

  deleteModal.style.display = 'flex';
}

function closeDeleteModal() {
  deleteModal.style.display = 'none';

  userToDelete = null;
}

openModalBtn.addEventListener('click', () => {
  closeUserModal();
  openUserModal();
});

closeModalBtn.addEventListener('click', () => {
  closeUserModal();
});

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleIdInput.value.trim();

  if (!name || !email) {
    showToast('Preencha nome e email');
    return;
  }

  const method = editingUserId ? 'PUT' : 'POST';
  const url = editingUserId ? `${API_URL}/${editingUserId}` : API_URL;

  try {
    saveButton.disabled = true;
    saveButton.textContent = 'Salvando...';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        role: role || 'customer',
        status: 'active',
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar usuário');
    }

    showToast(editingUserId ? 'Usuário atualizado com sucesso' : 'Usuário criado com sucesso');

    closeUserModal();

    loadUsers();
  } catch (error) {
    showToast(error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Salvar';
  }
});

document.addEventListener('click', (event) => {
  const button = event.target;
  const id = button.dataset.id;

  if (button.classList.contains('edit-btn')) {
    const user = usersData.find((user) => user.id == id);

    if (!user) return;

    editingUserId = id;

    nameInput.value = user.name;
    emailInput.value = user.email;
    roleIdInput.value = user.role || '';

    openUserModal();
  }

  if (button.classList.contains('delete-btn')) {
    const user = usersData.find((user) => user.id == id);

    if (!user) return;

    openDeleteModal(user);
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!userToDelete) return;

  try {
    const response = await fetch(`${API_URL}/${userToDelete}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir usuário');
    }

    showToast('Usuário desativado com sucesso');

    closeDeleteModal();

    loadUsers();
  } catch (error) {
    showToast(error.message);
  }
});

cancelDeleteBtn.addEventListener('click', () => {
  closeDeleteModal();
});

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredUsers = usersData.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  renderUsers(filteredUsers);
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

function showToast(message) {
  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

loadUsers();
