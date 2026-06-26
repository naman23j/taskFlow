import api from './api';

async function getAllBoards() {
  const response = await api.get('/boards');
  return response.data;
}

async function getBoardById(boardId) {
  const response = await api.get(`/boards/${boardId}`);
  return response.data;
}

async function createBoard(payload) {
  const response = await api.post('/boards', payload);
  return response.data;
}

async function updateBoard(boardId, payload) {
  const response = await api.patch(`/boards/${boardId}`, payload);
  return response.data;
}

async function deleteBoard(boardId) {
  const response = await api.delete(`/boards/${boardId}`);
  return response.data;
}

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
