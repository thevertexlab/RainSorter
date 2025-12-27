import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const fetchCollections = async (accessToken) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const [rootResponse, childrenResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/rest/v1/collections`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get(`${API_BASE_URL}/rest/v1/collections/childrens`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]);

    const allCollections = [
      ...(rootResponse.data.items || []),
      ...(childrenResponse.data.items || [])
    ];

    return allCollections;
  } catch (error) {
    console.error('Fetch collections error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to fetch collections');
  }
};

export const fetchSuggestions = async (accessToken, raindropId) => {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/rest/v1/raindrop/${raindropId}/suggest`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    return response.data.item || { collections: [], tags: [] };
  } catch (error) {
    console.error('Fetch suggestions error:', error);
    throw new Error(error.response?.data?.errorMessage || 'Failed to fetch suggestions');
  }
};
