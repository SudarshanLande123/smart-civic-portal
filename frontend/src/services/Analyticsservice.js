import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/analytics/summary");
  return response.data;
};

export const getCategoryStatistics = async () => {
  const response = await api.get("/analytics/categories");
  return response.data;
};

export const getStatusStatistics = async () => {
  const response = await api.get("/analytics/status");
  return response.data;
};

export const getMonthlyTrends = async () => {
  const response = await api.get("/analytics/trends");
  return response.data;
};

export const getTopProblemAreas = async () => {
  const response = await api.get("/analytics/areas");
  return response.data;
};