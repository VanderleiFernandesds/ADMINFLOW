const API_URL = 'http://localhost:3000/users';

let editingUserId = null;
let userToDelete = null;

const userTableBody = document.getElementById('userTableBody');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleIdInput = document.getElementById('roleId');

const openModalBtn = document.getElementById('openModalBtn');
const saveButton = userForm.querySelector('button[type="submit"]');

const deleteMessage = document.getElementById('deleteMessage');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

const toast = document.getElementById('toast');
const loading = document.getElementById('loading');

async function loadUsers() {
  try {
    loading.style.display = 'block';

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Erro ao carregar usuários');
    }

    const users = await response.json();

    renderUsers(users);
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
  userModal.style.display = 'block';
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

  deleteModal.style.display = 'block';
}

function closeDeleteModal() {
  deleteModal.style.display = 'none';

  userToDelete = null;
}

openModalBtn.addEventListener('click', () => {
  closeUserModal();
  openUserModal();
});

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const roleId = roleIdInput.value.trim();

  if (!name || !email || !roleId) {
    showToast('Preencha todos os campos');
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
        role_id: roleId,
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

document.addEventListener('click', async (event) => {
  const button = event.target;
  const id = button.dataset.id;

  if (button.classList.contains('edit-btn')) {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Erro ao carregar usuário');
      }

      const users = await response.json();

      const user = users.find((user) => user.id == id);

      if (!user) return;

      editingUserId = id;

      nameInput.value = user.name;
      emailInput.value = user.email;
      roleIdInput.value = user.role_id;

      openUserModal();
    } catch (error) {
      showToast(error.message);
    }
  }

  if (button.classList.contains('delete-btn')) {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Erro ao carregar usuário');
      }

      const users = await response.json();

      const user = users.find((user) => user.id == id);

      if (!user) return;

      openDeleteModal(user);
    } catch (error) {
      showToast(error.message);
    }
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

    showToast('Usuário excluído com sucesso');

    closeDeleteModal();

    loadUsers();
  } catch (error) {
    showToast(error.message);
  }
});

cancelDeleteBtn.addEventListener('click', () => {
  closeDeleteModal();
});

function showToast(message) {
  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

loadUsers();

const closeModalBtn = document.getElementById('closeModalBtn');

closeModalBtn.addEventListener('click', () => {
  closeUserModal();
});
