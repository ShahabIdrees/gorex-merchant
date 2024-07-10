import axios from 'axios';

const BASE_URL = 'https://gorex-api-gateway.gorex.pk/fueling';

const TransactionHistoryService = {
  getAllTransactionHistory: async (
    token,
    fuelStationUserDetailsId,
    page,
    limit,
  ) => {
    console.log('FSUDI: ' + fuelStationUserDetailsId);
    const url = `${BASE_URL}/api/transaction/get-all-transaction-by-fuel-station-user-id`;

    try {
      console.log('URL:', url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
          fuel_station_user_detail_id: fuelStationUserDetailsId,
        },
      });
      console.log('Get all history call:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during merchant employee History call:', error);
      throw error;
    }
  },
};

export default TransactionHistoryService;
