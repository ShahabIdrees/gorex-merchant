import axios from 'axios';
import {BASE_URL_FUELING} from './repos';

const BASE_URL = 'https://uat-gorex-api-gateway.gorex.pk/fueling';

const TransactionService = {
  postTransaction: async (token, transactionData) => {
    const url = `${BASE_URL_FUELING}/api/transaction/transaction-post`;
    try {
      console.log('URL:', url);
      console.log(
        'Transaction Data: ' + JSON.stringify(transactionData, null, 2),
      );
      // console.log('Transaction Data:', transactionData);
      const response = await axios.post(url, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(
        'Transaction Response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error) {
      console.error('Error posting the transaction:', error);
      throw error;
    }
  },
};

export default TransactionService;
