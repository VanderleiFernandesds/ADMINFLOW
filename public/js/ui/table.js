export function renderUsersTable(tableBody, users, currentUser) {
  tableBody.innerHTML = '';

  if (users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">Nenhum usuario encontrado</td>
      </tr>
    `;

    return;
  }

  users.forEach((user) => {
    const createdAt = user.created_at
      ? new Date(user.created_at).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '-';

    tableBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>${createdAt}</td>
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
