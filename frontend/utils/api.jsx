import axios from "axios";
import { API_URL } from "./config";

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};


export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  if (typeof window !== 'undefined') {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  if (typeof window !== 'undefined') {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};

export const getAllSkills = async () => {
  const res = await axios.get(`${API_URL}/skills`);
  return res.data;
};

export const getSkillById = async (id) => {
  const res = await axios.get(`${API_URL}/skills/${id}`);
  return res.data;
};

export const createSkill = async (skillData) => {
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/create`, skillData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const requestSkill = async (id, message) => {
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/${id}/request`, { message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const requestSkillExchange = async (id, message, offeredSkill) => {
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/${id}/exchange`, { 
    message, 
    offeredSkill 
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const token = getAuthToken();
  const res = await axios.put(`${API_URL}/skills/requests/${requestId}/status`, { 
    status 
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMySkills = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/skills/myskills`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMyRequests = async () => {
  try{
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/skills/myrequests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('get Request error:', error.response?.data);
  throw error;
}
};

export const createConnection = async (requestId, skillOffered, skillReceived) => {
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/connections`, {
    requestId,
    skillOffered,
    skillReceived
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMyConnections = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/connections/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateConnectionStatus = async (connectionId, status) => {
  const token = getAuthToken();
  const res = await axios.put(`${API_URL}/connections/${connectionId}/status`, {
    status
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const removeConnection = async (connectionId) => {
  const token = getAuthToken();
  const res = await axios.delete(`${API_URL}/connections/${connectionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem("token");
  }
  return false;
};
