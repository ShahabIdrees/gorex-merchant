import axios from 'axios';
import {BASE_URL_FUELING} from './repos';

const SalesService = {
  getSalesDataForPeriod: async (
    token,
    fuelStationUserDetailsId,
    startDate,
    endDate,
  ) => {
    console.log('FSUDI: ' + fuelStationUserDetailsId);
    console.log('Tokin: ' + token);

    const url = `${BASE_URL_FUELING}/api/transaction/get-merchant-application-user-analytics`;
    const params = {
      start_date: startDate,
      end_date: endDate,
      fuel_station_user_detail_id: fuelStationUserDetailsId,
    };

    console.log('URL:', url);
    console.log('Request Params:', JSON.stringify(params));
    console.log(
      'Request Headers:',
      JSON.stringify({
        Authorization: `Bearer ${token}`,
      }),
    );

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      console.log(
        'Get Sales data over a period:',
        JSON.stringify(response.data, null, 3),
      );

      return response.data;
    } catch (error) {
      console.error('Error during merchant employee History call:', error);
      throw error;
    }
  },
};

export default SalesService;
