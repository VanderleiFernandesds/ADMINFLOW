export function getCurrentUser() {
  try {
    const userString = localStorage.getItem('user');

    if (!userString) {
      return null;
    }

    return JSON.parse(userString);
  } catch (error) {
    console.error('Erro ao ler o usuário atual do localStorage:', error);
    return null;
  }
}
