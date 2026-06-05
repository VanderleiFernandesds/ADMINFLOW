export function renderPagination({ currentPage, totalPages, pageInfo, prevPageBtn, nextPageBtn }) {
  pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}
