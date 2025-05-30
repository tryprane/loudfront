import axios from 'axios';
import { Member, MemberChange, ChangesSummary, ApiResponse } from '../types';

const API_BASE_URL = 'http://rpc.servox.store/loud/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Remove withCredentials since we're using a proxy
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', {
        url: error.config?.url,
        method: error.config?.method
      });
      return Promise.reject({
        message: 'No response received from server. Please check your connection.',
        details: error.message
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({
        message: 'Error setting up the request. Please try again.',
        details: error.message
      });
    }
  }
);

export const getMembers = async (): Promise<ApiResponse<Member[]>> => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const getChanges = async (limit: number = 5, timeRange?: string): Promise<ApiResponse<{
  newMembers: Member[];
  removedMembers: Member[];
  rankChanges: { member: Member; previousRank: number }[];
}>> => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (timeRange) params.append('timeRange', timeRange);

    const response = await api.get<ApiResponse<{
      newMembers: Member[];
      removedMembers: Member[];
      rankChanges: { member: Member; previousRank: number }[];
    }>>(`/changes?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching changes:', error);
    throw error;
  }
};

export const getAllChanges = async (): Promise<ApiResponse<MemberChange[]>> => {
  try {
    const response = await api.get('/changes/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all changes:', error);
    throw error;
  }
};

export const getStats = async (): Promise<ApiResponse<{
  uptime: number;
  memoryUsage: number;
  wsClients: number;
  totalMembers: number;
  totalChanges: number;
  historySnapshots: number;
  lastUpdate: string;
}>> => {
  try {
    const response = await api.get<ApiResponse<{
      uptime: number;
      memoryUsage: number;
      wsClients: number;
      totalMembers: number;
      totalChanges: number;
      historySnapshots: number;
      lastUpdate: string;
    }>>('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const triggerScrape = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post<ApiResponse<void>>('/scrape');
    return response.data;
  } catch (error) {
    console.error('Error triggering scrape:', error);
    throw error;
  }
}; 