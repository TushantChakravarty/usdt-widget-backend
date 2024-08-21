import CryptoJS from "crypto-js";

async function generatePayloadAndSignature(secret, body) {
    const timestamp = Date.now().toString();
    const obj = {
        body,
        timestamp
    };
    const payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(obj)));
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, secret));
    return { payload, signature };
}
export async function usdtMarketPlace() {
    try {
        // 1 herer is the body 
        const body = {
            customerId: "",
            email: "tshubhanshu007@gmail.com",
            phoneNumber: "+918318089088",
            clientCustomerId: "1255377",
            type: "INDIVIDUAL",
            kycRedirectUrl: "",
            closeAfterLogin: true
        }

        // 2.this is header
        const apiKey = "mMAbfMAMWqSDWnnxLFmqNMclaDwiSgd"
        const secret = "WBEraoLeiTgorLlXpIDpuKFRwAecdJSM"
        // 3. making signature
        const { payload, signature } = await generatePayloadAndSignature(secret, body)

        // 4. this is header
        const headers = {
            'apikey': apiKey,
            'payload': payload,
            'signature': signature,
        };

        const headers2 = {
            'apiKey': apiKey,
            'payload': payload,
            'signature': signature
        }
        console.log(headers2)
        const response = await fetch('https://api.onramp.money/onramp/api/v2/whiteLabel/kyc/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'payload': payload,
                'signature': signature,
            },
            body: JSON.stringify(body)
        });
        console.log(response)

        const data = await response.json();
        console.log("this is response datatatattatata", data)



    } catch (err) {

    }
}