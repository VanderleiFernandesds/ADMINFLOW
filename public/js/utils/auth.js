export function getToken() {
  return localStorage.getItem('token');
}

export async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,

    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(
    url,

    {
      ...options,

      headers,
    }
  );

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = 'login.html';
  }

  return response;
}
