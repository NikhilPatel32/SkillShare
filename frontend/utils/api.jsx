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
  try{
  const res = await axios.get(`${API_URL}/skills`);
  return res.data;
  }
  catch(error){
  console.error('get all skills error:', error.response?.data);
  throw error;
}
};

export const getSkillById = async (id) => {
  try{
  const res = await axios.get(`${API_URL}/skills/${id}`);
  return res.data;
  }
  catch(error){
  console.error('get a single skill error:', error.response?.data);
  throw error;
}
};

export const createSkill = async (skillData) => {
  try{
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/create`, skillData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('create skill error:', error.response?.data);
  throw error;
}
};

export const requestSkill = async (id, message) => {
  try{
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/${id}/request`, { message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('skill request error:', error.response?.data);
  throw error;
}
};

export const requestSkillExchange = async (id, message, offeredSkill) => {
  try{
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/skills/${id}/exchange`, { 
    message, 
    offeredSkill 
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('skill change error:', error.response?.data);
  throw error;
}
};

export const updateRequestStatus = async (requestId, status) => {
  try{
  const token = getAuthToken();
  const res = await axios.put(`${API_URL}/skills/requests/${requestId}/status`, { 
    status 
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('update request error:', error.response?.data);
  throw error;
}
};

export const getMySkills = async () => {
  try{
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/skills/myskills`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('get my skills error:', error.response?.data);
  throw error;
}
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
  try{
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/connections`, {
    requestId,
    skillOffered,
    skillReceived
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('create connection error:', error.response?.data);
  throw error;
}
};

export const getMyConnections = async () => {
  try{
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/connections/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('get connection error:', error.response?.data);
  throw error;
}
};

export const updateConnectionStatus = async (connectionId, status) => {
  try{
  const token = getAuthToken();
  const res = await axios.put(`${API_URL}/connections/${connectionId}/status`, {
    status
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
  console.error('update connection error:', error.response?.data);
  throw error;
}
};

export const removeConnection = async (connectionId) => {
  try{
  const token = getAuthToken();
  const res = await axios.delete(`${API_URL}/connections/${connectionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
catch(error){
   console.error('remove connection error:', error.response?.data);
  throw error;
}
};


export const getCurrentUser = () => {
  try{
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}
catch(error){
 console.error('get current user error:', error.response?.data);
  throw error;
}
};

export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem("token");
  }
  return false;
};
