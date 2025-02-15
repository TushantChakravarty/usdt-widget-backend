import axios from 'axios';

const MERCURYO_API_BASE = 'https://sandbox-cryptosaas.mrcr.io/v1.6/b2b'; // Adjust if necessary
const B2B_AUTH_TOKEN = '108:0d69aff67073a1040_PfFkay8tFsoqJPstOkR2oF_i10jspeJQdIdDBXkqyFABdW'; // Replace with your actual token

export const signUpUser = async ({ email }) => {
    try {
        const response = await axios.post(
            `${MERCURYO_API_BASE}/user/sign-up`,
            {
                accept:true,
                email,
               
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Sdk-Partner-Token': B2B_AUTH_TOKEN
                }
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status,
            error: error.response?.data || 'Internal Server Error'
        };
    }
};

export const signInUser = async ({ email,phone,id }) => {
    try {
        const response = await axios.post(
            `${MERCURYO_API_BASE}/user/sign-in`,
            {
                email,
                phone,
                user_uuid4:id
               
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Sdk-Partner-Token': B2B_AUTH_TOKEN
                }
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status,
            error: error.response?.data || 'Internal Server Error'
        };
    }
};

// Test the function
const testUser = {
    email: 'user@example.com',
    phone:'123456789',
    id:1
};

(async () => {
    const response = await signUpUser(testUser);
    //const response = await signInUser(testUser)
    console.log(response);
})();
