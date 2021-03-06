/*
 * File for containing all the different HTTP calls to the backend service
 * Export statement at the bottom for summary of calls
 */

import axios from 'axios';
import { API_ENDPOINT } from '../constants';

// Confirm user is logged in
const checkAuth = async () => {
  try {
    return await axios.post(`${API_ENDPOINT}/session`);
  } catch (err) {
    throw err;
  }
};

const clearNotifications = async (notifications) => {
  try {
    await axios.delete(`${API_ENDPOINT}/notifications`, { data: { notifications } });
  } catch (err) {
    throw err;
  }
};

const createIssue = async (values) => {
  try {
    return await axios.put(`${API_ENDPOINT}/issue`, values);
  } catch (err) {
    throw err;
  }
};

const createSession = async (event) => {
  try {
    await axios.post(`${API_ENDPOINT}/room/session`, {
      id: JSON.parse(localStorage.getItem('teams'))[event.key - 1].id,
    });
  } catch (err) {
    throw err;
  }
};

const createTeam = async (data) => {
  try {
    return await axios.put(`${API_ENDPOINT}/room`, data);
  } catch (err) {
    throw err;
  }
};

const deleteIssue = async (id) => {
  try {
    await axios.delete(`${API_ENDPOINT}/issue/${id}`);
  } catch (err) {
    throw err;
  }
};

const deleteRoom = async (email, password) => {
  try {
    await axios.delete(`${API_ENDPOINT}/room`, { data: { email: email, password: password } });
  } catch (err) {
    throw err;
  }
};

// Called when user uses complete button on dashboard
const endSprint = async (issues, name) => {
  try {
    await axios.post(`${API_ENDPOINT}/issue/completed`, { issues, name });
  } catch (err) {
    throw err;
  }
};

const getAvatar = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/avatar`);
  } catch (err) {
    throw new err();
  }
};

const getIssues = async (type) => {
  try {
    return await axios.get(`${API_ENDPOINT}/issue/${type}/1`);
  } catch (err) {
    throw err;
  }
};

const getIssueById = async (issue) => {
  try {
    return await axios.get(`${API_ENDPOINT}/issue/${issue}`);
  } catch (err) {
    throw err;
  }
};

const getChat = async (issue) => {
  try {
    return await axios.get(`${API_ENDPOINT}/chats`);
  } catch (err) {
    throw err;
  }
};

const getLastReadChat = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/chats/last-read`);
  } catch (err) {
    throw err;
  }
};

const getLogs = async (filter) => {
  try {
    return await axios.get(`${API_ENDPOINT}/logs`);
  } catch (err) {
    throw err;
  }
};

const getLogsForGraph = async (filter) => {
  try {
    return await axios.get(`${API_ENDPOINT}/logs/graph`);
  } catch (err) {
    throw err;
  }
};

const getNotes = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/notes`);
  } catch (err) {
    throw err;
  }
};

const getRoomBanList = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/room/ban-list`);
  } catch (err) {
    throw new err();
  }
};

const getRepository = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/repository`);
  } catch (err) {
    throw new err();
  }
};

const getRoomAdminTiers = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/user/room/tier`);
  } catch (err) {
    throw new err();
  }
};

const joinTeam = async (data) => {
  try {
    return await axios.post(`${API_ENDPOINT}/member/room`, data);
  } catch (err) {
    throw err;
  }
};

const leaveTeam = async (teamId) => {
  try {
    return await axios.delete(`${API_ENDPOINT}/member/room`, { data: { teamId } });
  } catch (err) {
    throw err;
  }
};

const logout = async () => {
  try {
    await axios.post(`${API_ENDPOINT}/logout`);
  } catch (err) {
    throw err;
  }
};

const removeMember = async (id, name, type) => {
  try {
    return await axios.delete(`${API_ENDPOINT}/room/user/${id}`, { data: { name, type } });
  } catch (err) {
    throw err;
  }
};

const retrieveAssignees = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/assignees`);
  } catch (err) {
    throw err;
  }
};

const retrieveMembers = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/members`);
  } catch (err) {
    throw err;
  }
};

const retrieveNotifications = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/notifications`);
  } catch (err) {
    throw err;
  }
};

const retrieveTeams = async () => {
  try {
    return await axios.get(`${API_ENDPOINT}/room`);
  } catch (err) {
    throw err;
  }
};

const sendNotificationsRead = async (data) => {
  try {
    await axios.post(`${API_ENDPOINT}/notifications`, data);
  } catch (err) {
    throw err;
  }
};

const sendShareIssueNotification = async (issue, issueId, message, users) => {
  try {
    await axios.post(`${API_ENDPOINT}/issue/share`, { issue, issueId, message, users });
  } catch (err) {
    throw err;
  }
};

const updateLastReadChat = async (date) => {
  try {
    await axios.post(`${API_ENDPOINT}/chats/last-read`, { date });
  } catch (err) {
    throw err;
  }
};

const updateRoomBanList = async (id) => {
  try {
    await axios.post(`${API_ENDPOINT}/room/ban-list`, { id });
  } catch (err) {
    throw err;
  }
};

const updateIssue = async (id, status) => {
  try {
    await axios.post(`${API_ENDPOINT}/issue/progress`, { id, status });
  } catch (err) {
    throw err;
  }
};

const updateLayout = async (notes, layout, date, oldDate) => {
  try {
    await axios.post(`${API_ENDPOINT}/notes`, { notes, layout, date, oldDate });
  } catch (err) {
    throw err;
  }
};

const updateUserAdminTier = async (name, id, tier) => {
  try {
    await axios.post(`${API_ENDPOINT}/user/room/tier`, { name, id, tier });
  } catch (err) {
    throw err;
  }
};

export {
  checkAuth,
  clearNotifications,
  createIssue,
  createSession,
  createTeam,
  deleteIssue,
  deleteRoom,
  endSprint,
  getRoomBanList,
  getAvatar,
  getLastReadChat,
  getChat,
  getLogs,
  getLogsForGraph,
  getNotes,
  getIssues,
  getIssueById,
  getRepository,
  getRoomAdminTiers,
  joinTeam,
  leaveTeam,
  logout,
  removeMember,
  retrieveAssignees,
  retrieveMembers,
  retrieveNotifications,
  retrieveTeams,
  sendShareIssueNotification,
  sendNotificationsRead,
  updateLastReadChat,
  updateRoomBanList,
  updateIssue,
  updateLayout,
  updateUserAdminTier,
};
