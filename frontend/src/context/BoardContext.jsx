import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import boardService from '../services/boardService';
import taskService from '../services/taskService';

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await boardService.getAllBoards();
      setBoards(response.boards);
      return response.boards;
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load boards');
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (payload) => {
    const response = await boardService.createBoard(payload);
    setBoards((current) => [response.board, ...current]);
    return response.board;
  }, []);

  const updateBoard = useCallback(async (boardId, payload) => {
    const response = await boardService.updateBoard(boardId, payload);
    setBoards((current) => current.map((board) => (board.id === boardId ? response.board : board)));
    setCurrentBoard((current) => (current?.id === boardId ? response.board : current));
    return response.board;
  }, []);

  const deleteBoard = useCallback(async (boardId) => {
    await boardService.deleteBoard(boardId);
    setBoards((current) => current.filter((board) => board.id !== boardId));
    setCurrentBoard((current) => {
      if (current?.id === boardId) {
        setTasks([]);
        return null;
      }
      return current;
    });
  }, []);

  const fetchBoard = useCallback(async (boardId) => {
    setLoading(true);
    setError('');
    try {
      const response = await boardService.getBoardById(boardId);
      setCurrentBoard(response.board);
      setTasks(response.tasks);
      return response;
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load board');
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBoardTasks = useCallback(async (boardId) => {
    const response = await boardService.getBoardById(boardId);
    setCurrentBoard(response.board);
    setTasks(response.tasks);
    return response.tasks;
  }, []);

  const createTask = useCallback(async (boardId, payload) => {
    const response = await taskService.createTask(boardId, payload);
    setTasks((current) => [response.task, ...current]);
    return response.task;
  }, []);

  const updateTask = useCallback(async (boardId, taskId, payload) => {
    const response = await taskService.updateTask(boardId, taskId, payload);
    setTasks((current) => current.map((task) => (task.id === taskId ? response.task : task)));
    return response.task;
  }, []);

  const deleteTask = useCallback(async (boardId, taskId) => {
    await taskService.deleteTask(boardId, taskId);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  const suggestEstimate = useCallback(async (title, description) => {
    return taskService.suggestEstimate(title, description);
  }, []);

  const value = useMemo(() => ({
    boards,
    currentBoard,
    tasks,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchBoard,
    refreshBoardTasks,
    createTask,
    updateTask,
    deleteTask,
    suggestEstimate,
    setError,
    setCurrentBoard,
    setTasks,
  }), [
    boards,
    currentBoard,
    tasks,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchBoard,
    refreshBoardTasks,
    createTask,
    updateTask,
    deleteTask,
    suggestEstimate,
  ]);

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within BoardProvider');
  }
  return context;
}
