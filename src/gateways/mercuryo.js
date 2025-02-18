import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

const MERCURYO_API_BASE = "https://sandbox-cryptosaas.mrcr.io/v1.6/b2b"; // Adjust if necessary
const B2B_AUTH_TOKEN =
  "108:0d69aff67073a1040_PfFkay8tFsoqJPstOkR2oF_i10jspeJQdIdDBXkqyFABdW"; // Replace with your actual token

// SOCKS5 Proxy Agent to route requests through EC2
const proxyAgent = new SocksProxyAgent("socks5h://127.0.0.1:8080");

export const signUpUser = async ({ email }) => {
  try {
    const response = await axios.post(
      `${MERCURYO_API_BASE}/user/sign-up`,
      {
        accept: true,
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Sdk-Partner-Token": B2B_AUTH_TOKEN,
        },
        httpAgent: proxyAgent, // <-- Add this
        httpsAgent: proxyAgent, // <-- Add this
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const signInUser = async ({ email, phone, id }) => {
  try {
    const response = await axios.post(
      `${MERCURYO_API_BASE}/user/sign-in`,
      {
        email,
        //phone,
        user_uuid4: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Sdk-Partner-Token": B2B_AUTH_TOKEN,
        },
        httpAgent: proxyAgent, // <-- Add this
        httpsAgent: proxyAgent, // <-- Add this
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const getCurrencies = async () => {
  try {
    const response = await axios.get(`${MERCURYO_API_BASE}/currencies`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Sdk-Partner-Token": B2B_AUTH_TOKEN,
      },
      httpAgent: proxyAgent, // <-- Add this
      httpsAgent: proxyAgent, // <-- Add this
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const getRates = async () => {
  try {
    const response = await axios.get(`${MERCURYO_API_BASE}/rates`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Sdk-Partner-Token": B2B_AUTH_TOKEN,
      },
      httpAgent: proxyAgent, // <-- Add this
      httpsAgent: proxyAgent, // <-- Add this
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const sellMethods = async () => {
  try {
    const response = await axios.get(`${MERCURYO_API_BASE}/oor/sell-methods`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "B2B-Bearer-Token":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtcmNyLmlvIiwiaWF0IjoxNzM5Nzc3MDA5LCJqdGkiOiJxajZnVnNQTzRCYTQ0MXNld2hZWmVrM3BkSXBGV2ZuRlk5MkhjWVZFYXhBPSIsIm5iZiI6MTczOTc3Njk3OSwiZGF0YSI6eyJ1c2VyX2lkIjo1MzEwLCJhZGRpdGlvbmFsIjp7IndpZGdldF9pZCI6ImM3ZTBjMzdmLWVlNjAtNGFjNy1iYzU2LWZiMDMzOTRjNTNhOCIsImV4Y2hhbmdlX3BhcnRuZXJfaWQiOjE3NCwic2RrX3BhcnRuZXJfaWQiOjEwOCwicHJvZHVjdCI6InNhYXMiLCJzY29wZXMiOlsiYjJiX2FwaSJdLCJyZXZvY2FibGUiOmZhbHNlfX19.EUOpxD09hEy56ATkYS-a9fBFZHT0ozkbabnhpTh15Uc", //B2B_AUTH_TOKEN
      },
      httpAgent: proxyAgent, // <-- Add this
      httpsAgent: proxyAgent, // <-- Add this
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const sellRates = async () => {
  try {
    const response = await axios.get(
      `${MERCURYO_API_BASE}/oor/sell-rates?from=BTC&to=EUR&amount_from=0.1`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "B2B-Bearer-Token":
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtcmNyLmlvIiwiaWF0IjoxNzM5Nzc3MDA5LCJqdGkiOiJxajZnVnNQTzRCYTQ0MXNld2hZWmVrM3BkSXBGV2ZuRlk5MkhjWVZFYXhBPSIsIm5iZiI6MTczOTc3Njk3OSwiZGF0YSI6eyJ1c2VyX2lkIjo1MzEwLCJhZGRpdGlvbmFsIjp7IndpZGdldF9pZCI6ImM3ZTBjMzdmLWVlNjAtNGFjNy1iYzU2LWZiMDMzOTRjNTNhOCIsImV4Y2hhbmdlX3BhcnRuZXJfaWQiOjE3NCwic2RrX3BhcnRuZXJfaWQiOjEwOCwicHJvZHVjdCI6InNhYXMiLCJzY29wZXMiOlsiYjJiX2FwaSJdLCJyZXZvY2FibGUiOmZhbHNlfX19.EUOpxD09hEy56ATkYS-a9fBFZHT0ozkbabnhpTh15Uc", //B2B_AUTH_TOKEN
        },
        httpAgent: proxyAgent, // <-- Add this
        httpsAgent: proxyAgent, // <-- Add this
      }
    );
   
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data || "Internal Server Error",
    };
  }
};

export const sellUsdtByCard = async () => {
    try {
      const response = await axios.post(`${MERCURYO_API_BASE}/oor/sell/card`,
        {
            "address": 7.60053267365776e+47,
            "card_expiration_month": "11",
            "card_expiration_year": "2026",
            "card_holder_name": "John Doe",
            "card_id": "018ab9cc29a8a2543",
            "card_number": "4111111111111111",
            "merchant_transaction_id": "87654321",
            "trx_token": "dc66faa031f11e779dd10b94593eb140214a8460edc231d5aa831f147efd7d7beyJ0IjoxNzM5Nzg2MzMzLCJjIjoiQlRDIiwiYSI6IjAuMTAwMDAwMDAiLCJmYyI6IkVVUiIsImZhIjoiODgzOS4xMyIsImYiOiIzNDkuMTUiLCJyIjoiOTE4ODIuNzQiLCJjaWQiOiIyYTU4NDI5OTQ4ZmYzNjIzNDk0YmRmNGI0OTg2Yjc4YSIsIm9wIjoic2VsbCIsInB0IjpudWxsLCJwYSI6ImNhcmQiLCJ0dCI6dHJ1ZSwidGYiOiIwIiwidyI6ImM3ZTBjMzdmLWVlNjAtNGFjNy1iYzU2LWZiMDMzOTRjNTNhOCIsInNmIjoiMzQ5LjE1IiwicHMiOm51bGwsImZpIjpudWxsLCJuIjoiQklUQ09JTiIsIm1jIjpudWxsLCJmbCI6bnVsbH0="
          }
      , {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "B2B-Bearer-Token":
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtcmNyLmlvIiwiaWF0IjoxNzM5Nzc3MDA5LCJqdGkiOiJxajZnVnNQTzRCYTQ0MXNld2hZWmVrM3BkSXBGV2ZuRlk5MkhjWVZFYXhBPSIsIm5iZiI6MTczOTc3Njk3OSwiZGF0YSI6eyJ1c2VyX2lkIjo1MzEwLCJhZGRpdGlvbmFsIjp7IndpZGdldF9pZCI6ImM3ZTBjMzdmLWVlNjAtNGFjNy1iYzU2LWZiMDMzOTRjNTNhOCIsImV4Y2hhbmdlX3BhcnRuZXJfaWQiOjE3NCwic2RrX3BhcnRuZXJfaWQiOjEwOCwicHJvZHVjdCI6InNhYXMiLCJzY29wZXMiOlsiYjJiX2FwaSJdLCJyZXZvY2FibGUiOmZhbHNlfX19.EUOpxD09hEy56ATkYS-a9fBFZHT0ozkbabnhpTh15Uc", //B2B_AUTH_TOKEN
        },
        httpAgent: proxyAgent, // <-- Add this
        httpsAgent: proxyAgent, // <-- Add this
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data || "Internal Server Error",
      };
    }
  };

// Test the function
const testUser = {
  email: "user2@example.com",
  //phone: '123456789',
  id: "ead692f3-18cf-4187-b331-83fda798b917",
};

(async () => {
  // Test sign-up
  //const response = await signUpUser(testUser);

  // Test sign-in
  // const response = await signInUser(testUser);
  // const response = await getCurrencies()
  // const response = await getRates()
  // const response = await sellMethods()
//   const response = await sellRates();
const response = await sellUsdtByCard()

  console.log(response);
})();
