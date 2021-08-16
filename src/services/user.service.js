import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getAllTasks = () => {
  return axios.get(API_URL + "tasks", { headers: authHeader() });
};

const updateTask = (id, name, completed) => {
  return axios.put(API_URL + `tasks/${id}`, {
    completed,
    name,
    headers: authHeader(),
  });
};

const createTask = (task) => {
  return axios.post(API_URL + "tasks", task, { headers: authHeader() });
};

const deleteTask = (id) => {
  return axios.delete(API_URL + `tasks/${id}`, { headers: authHeader() });
};

const getUserBoard = () => {
  return axios.get(API_URL + "dashboard", { headers: authHeader() });
};

const user = {
  getAllTasks,
  getUserBoard,
  updateTask,
  createTask,
  deleteTask,
};

export default user;
