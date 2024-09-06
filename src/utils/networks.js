export const networks = [
    {
      "chainSymbol": "erc20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Ethereum Network",
      "hashLink": "https://etherscan.io/tx/",
      "node": 6,
      "startingWith": ["0x"],
      "networkId": 1,
      "nativeToken": 6
    },
    {
      "chainSymbol": "bep20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Binance Smart Chain",
      "hashLink": "https://bscscan.com/tx/",
      "node": 110,
      "startingWith": ["0x"],
      "networkId": 56,
      "nativeToken": 72
    },
    {
      "chainSymbol": "trc20",
      "addressRegex": "^T[1-9A-HJ-NP-Za-km-z]{33}$",
      "memoRegex": "",
      "chainName": "TRC20 Token Standard",
      "hashLink": "https://tronscan.org/#/transaction/",
      "node": 16,
      "startingWith": ["T"],
      "networkId": -1,
      "nativeToken": 16
    },
    {
      "chainSymbol": "matic20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Polygon Mainnet",
      "hashLink": "https://polygonscan.com/tx/",
      "node": 83,
      "startingWith": ["0x"],
      "networkId": 137,
      "nativeToken": 83
    },
    {
      "chainSymbol": "spl",
      "addressRegex": "^[1-9A-HJ-NP-Za-km-z]{32,44}$",
      "memoRegex": "",
      "chainName": "Solana Program Library Network",
      "hashLink": "https://explorer.solana.com/tx/",
      "node": 138,
      "networkId": -1,
      "nativeToken": 138
    },
    {
      "chainSymbol": "eos",
      "addressRegex": "^[1-5a-z\\.]{1,12}$",
      "memoRegex": "^[0-9A-Za-z\\-_,]{1,120}$",
      "chainName": "EOS",
      "hashLink": "https://www.bloks.io/transaction/",
      "node": 20
    },
    {
      "chainSymbol": "arbitrum",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Arbitrum",
      "hashLink": "https://arbiscan.io/tx/",
      "node": 6,
      "startingWith": ["0x"],
      "networkId": 42161,
      "nativeToken": 6
    },
    {
      "chainSymbol": "ton",
      "addressRegex": "^[UE][Qf][0-9a-z-A-Z\\-\\_]{46}$|\\.tg",
      "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
      "chainName": "Toncoin"
    },
    {
      "chainSymbol": "optimism",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Optimism",
      "nativeToken": 6,
      "networkId": 10
    },
    {
      "chainSymbol": "avaxc",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "AVAX C-Chain",
      "nativeToken": 275,
      "networkId": 43114
    },
    {
      "chainSymbol": "celo",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "CELO",
      "nativeToken": 316,
      "networkId": 42220
    }
  ]
  