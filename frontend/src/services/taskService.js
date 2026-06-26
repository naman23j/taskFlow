import api from './api';

async function getTasksByBoard(boardId, filters = {}) {
  const response = await api.get(`/boards/${boardId}/tasks`, { params: filters });
  return response.data;
}

async function getTaskById(boardId, taskId) {
  const response = await api.get(`/boards/${boardId}/tasks/${taskId}`);
  return response.data;
}

async function createTask(boardId, payload) {
  const response = await api.post(`/boards/${boardId}/tasks`, payload);
  return response.data;
}

async function updateTask(boardId, taskId, payload) {
  const response = await api.patch(`/boards/${boardId}/tasks/${taskId}`, payload);
  return response.data;
}

async function deleteTask(boardId, taskId) {
  const response = await api.delete(`/boards/${boardId}/tasks/${taskId}`);
  return response.data;
}

async function suggestEstimate(title, description) {
  const response = await api.post('/tasks/suggest-estimate', { title, description });
  return response.data;
}

export default {
  getTasksByBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  suggestEstimate,
};
