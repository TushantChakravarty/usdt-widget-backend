export async function generateToken()
{
    try{

        let body ={
            email_id:process.env.globalpayUsername,
            password:process.env.globalpayPassword
        }
        const response = await fetch('http://localhost:3001/user/generateToken',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
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

export async function createPayoutBankRequest(token,body)
{
    try{

        const response = await fetch('http://localhost:3001/payout/bank',{
            method:'post',
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`,
                apiKey:process.env.globalpayApiKey
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