export function renderUsersTable(tableBody, users, currentUser) {
  tableBody.innerHTML = '';

  if (users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">Nenhum usuario encontrado</td>
      </tr>
    `;

    return;
  }

  users.forEach((user) => {
    tableBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Editar</button>
          ${
            currentUser?.role === 1
              ? `<button class="delete-btn" data-id="${user.id}">Excluir</button>`
              : ''
          }
        </td>
      </tr>
    `;
  });
}
