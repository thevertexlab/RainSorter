import axios from 'axios';
import { API_BASE_URL, COLLECTION_IDS } from '../utils/constants';

export const fetchRaindrops = async (accessToken, page = 0, perpage = 50) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/rest/v1/raindrops/${COLLECTION_IDS.UNSORTED}`,
      {
        params: { page, perpage },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return {
      items: response.data.items || [],
      count: response.data.count || 0
    };
  } catch (error) {
    console.error('Fetch raindrops error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to fetch raindrops');
  }
};

export const fetchRaindropsByTag = async (accessToken, tag, page = 0, perpage = 50) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/rest/v1/raindrops/0`,
      {
        params: {
          page,
          perpage,
          search: `#${tag}`
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return {
      items: response.data.items || [],
      count: response.data.count || 0
    };
  } catch (error) {
    console.error('Fetch raindrops by tag error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to fetch tagged raindrops');
  }
};

export const updateRaindrop = async (accessToken, raindropId, updates) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/rest/v1/raindrop/${raindropId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.item;
  } catch (error) {
    console.error('Update raindrop error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to update raindrop');
  }
};

export const fetchRaindropsByCollection = async (accessToken, collectionId, page = 0, perpage = 50) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/rest/v1/raindrops/${collectionId}`,
      {
        params: { page, perpage },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return {
      items: response.data.items || [],
      count: response.data.count || 0
    };
  } catch (error) {
    console.error('Fetch raindrops by collection error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to fetch collection raindrops');
  }
};
