import axios from 'axios';

const BASE_URL = 'https://uat-gorex-api-gateway.gorex.pk/auth';

const AuthService = {
  merchantEmployeeLogin: async (phone, password) => {
    console.log('phone: ' + phone);
    const url = `${BASE_URL}/api/user/login-fuel-station-mobile-app`;

    try {
      console.log('URL:', url);
      const response = await axios.post(url, {
        phone: phone,
        password: password,
      });
      console.log('Login call:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error during merchant employee login:', error);
      //   throw error;
    }
  },
};

export default AuthService;
