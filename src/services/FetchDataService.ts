import { DataParams } from '../models/DataParams';
import axios from 'axios';

export const FetchDataService = async (params: DataParams): Promise<DataParams> => {
  const formData = new FormData();
  if (params.csvFile) {
    formData.append('file', params.csvFile);
  }

  const queryString = new URLSearchParams({
    fixedPrice: params.fixedPrice.toString(),
    ...(params.marginal !== undefined && { marginal: params.marginal.toFixed(2) }) // Add marginal if it exists
  }).toString();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_APP_FINGRID_PATH}?${queryString}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data as DataParams;
  } catch (error) {
    throw error;
  }
};