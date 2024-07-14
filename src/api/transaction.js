import axios from 'axios';

const BASE_URL = 'https://gorex-api-gateway.gorex.pk/fueling';

const TransactionService = {
  postTransaction: async (token, transactionData) => {
    const url = `${BASE_URL}/api/transaction/transaction-post`;

    try {
      console.log('URL:', url);
      console.log('Transaction Data:', transactionData);
      const response = await axios.post(url, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Transaction Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during posting the transaction:', error);
      throw error;
    }
  },
};

export default TransactionService;
