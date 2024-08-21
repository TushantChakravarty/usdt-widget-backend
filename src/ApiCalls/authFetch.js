
import logger from "../utils/logger.util.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithFibonacciDelay = async (fn, retries = 10) => {
    let attempts = 0;
    let [prev, curr] = [0, 1];

    while (attempts < retries) {
        try {
            return await fn();
        } catch (error) {
            attempts++;
            if (attempts >= retries) {
                throw error;
            }
            const delay = curr * 1000; // delay in milliseconds
            await sleep(delay);
            [prev, curr] = [curr, prev + curr];
        }
    }
};

export class authFetch {
    static async get(url) {
        return retryWithFibonacciDelay(async () => {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'microApiKey': process.env.MICRO_API_KEY
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        }).catch(error => {
            logger.error(`authFetch.get ${error.message}`);
            return false;
        });
    }

    static async post(url, body) {
        return retryWithFibonacciDelay(async () => {
            console.log("Post fetch code ")
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'microApiKey': process.env.MICRO_API_KEY
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        }).catch(error => {
            logger.error(`authFetch.post ${error.message}`);
            return false;
        });
    }

    static async put(url, body) {
        return retryWithFibonacciDelay(async () => {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'microApiKey': process.env.MICRO_API_KEY
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        }).catch(error => {
            logger.error(`authFetch.put ${error.message}`);
            return false;
        });
    }

    static async delete(url) {
        return retryWithFibonacciDelay(async () => {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'microApiKey': process.env.MICRO_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        }).catch(error => {
            logger.error(`authFetch.delete ${error.message}`);
            return false;
        });
    }
}