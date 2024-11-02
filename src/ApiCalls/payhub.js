export async function generateToken()
{
    try{

        let body ={
            emailId:process.env.payhubUsername,
            password:process.env.payhubPasswrod
        }
        const response = await fetch('https://server.payhub.link/user/login',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        console.log('here')
        const resp =await response.json()
        console.log(resp)
        return resp
    }catch(error)
    {
        console.log(error)
    }
}

export async function createPayinBankRequest(userData,body)
{
    try{
        console.log(userData)
        const response = await fetch('https://server.payhub.link/user/sendPayinRequestHosted',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
                token:userData.token,
                apikey:`${userData.apiKey}`
            },
            body: JSON.stringify(body),
        })
        const resp =await response.json()
        console.log(resp)
        return resp
    }catch(error)
    {
        console.log(error)
    }
}
export async function createPayoutBankRequestPayhub(userData,body)
{
    try{
        console.log(userData)
        const response = await fetch('https://api.payhub.link/payouts/sendPayoutRequest',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
                token:userData.token,
                apikey:`${userData.apiKey}`
            },
            body: JSON.stringify(body),
        })
        const resp =await response.json()
        console.log(resp)
        return resp
    }catch(error)
    {
        console.log(error)
    }
}