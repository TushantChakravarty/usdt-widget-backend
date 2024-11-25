export function generateRandomFiatId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateRandomCustomerId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateTransactionId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateTransactionIdGateway(length) {
    //console.log('ran')
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let transactionId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        transactionId += characters.charAt(randomIndex);
    }
   // console.log(transactionId)
    return transactionId;
  }
  