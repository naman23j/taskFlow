const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createBoard,
  deleteBoard,
  getBoard,
  listBoards,
  updateBoard,
} = require('../controllers/boardController');
const {
  createTask,
  deleteTask,
  getTask,
  listBoardTasks,
  updateTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listBoards);
router.post('/', createBoard);
router.get('/:boardId', getBoard);
router.patch('/:boardId', updateBoard);
router.delete('/:boardId', deleteBoard);
router.get('/:boardId/tasks', listBoardTasks);
router.post('/:boardId/tasks', createTask);
router.get('/:boardId/tasks/:taskId', getTask);
router.patch('/:boardId/tasks/:taskId', updateTask);
router.delete('/:boardId/tasks/:taskId', deleteTask);

module.exports = router;
