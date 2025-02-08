import axios from 'axios';

const MERCURYO_API_BASE = 'https://oor-api.example.com/b2b'; // Replace with actual API URL
const B2B_AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // Replace with your actual token

export const signUpUser = async ({ email, password, first_name, last_name, phone_number, country }) => {
    try {
        const response = await axios.post(
            `${MERCURYO_API_BASE}/user/sign-up`,
            {
                email,
                password,
                first_name,
                last_name,
                phone_number,
                country,
                terms_of_service_accepted: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'b2b-auth-token': B2B_AUTH_TOKEN
                }
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Internal Server Error'
        };
    }
};

const testUser = {
    email: 'user@example.com',
    password: 'SecureP@ss123',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1234567890',
    country: 'US'
};

(async () => {
    const response = await signUpUser(testUser);
    console.log(response);
})();
