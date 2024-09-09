export const networks = [
  {
      "chainId": 0,
      "chainSymbol": "erc20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Ethereum Network",
      "hashLink": "https://etherscan.io/tx/",
      "node": 6,
      "startingWith": [
          "0x"
      ],
      "networkId": 1,
      "nativeToken": 6
  },
  {
      "chainId": 1,
      "chainSymbol": "bep20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Binance Smart Chain",
      "hashLink": "https://bscscan.com/tx/",
      "node": 110,
      "startingWith": [
          "0x"
      ],
      "networkId": 56,
      "nativeToken": 72
  },
  {
      "chainId": 2,
      "chainSymbol": "trc20",
      "addressRegex": "^T[1-9A-HJ-NP-Za-km-z]{33}$",
      "memoRegex": "",
      "chainName": "TRC20 Token Standard",
      "hashLink": "https://tronscan.org/#/transaction/",
      "node": 16,
      "startingWith": [
          "T"
      ],
      "networkId": -1,
      "nativeToken": 16
  },
  {
      "chainId": 3,
      "chainSymbol": "matic20",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Polygon Mainnet",
      "hashLink": "https://polygonscan.com/tx/",
      "node": 83,
      "startingWith": [
          "0x"
      ],
      "networkId": 137,
      "nativeToken": 83
  },
  {
      "chainId": 4,
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
      "chainId": 5,
      "chainSymbol": "bep2",
      "addressRegex": "^(bnb1)[0-9a-z]{38}$",
      "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
      "chainName": "Binance Chain",
      "hashLink": "https://explorer.binance.org/tx/",
      "node": 72,
      "startingWith": [
          "bnb"
      ]
  },
  {
      "chainId": 7,
      "chainSymbol": "nep5",
      "chainName": "NEO Enhancement Protocol",
      "hashLink": "https://neoscan.io/transaction/",
      "node": 3,
      "startingWith": [
          "A"
      ]
  },
  {
      "chainId": 8,
      "chainSymbol": "eos",
      "addressRegex": "^[1-5a-z\\.]{1,12}$",
      "memoRegex": "^[0-9A-Za-z\\-_,]{1,120}$",
      "chainName": "EOS",
      "hashLink": "https://www.bloks.io/transaction/",
      "node": 20
  },
  {
      "chainId": 9,
      "chainSymbol": "klay",
      "chainName": "Klaytn Protocol",
      "hashLink": "https://scope.klaytn.com/tx/",
      "node": 372,
      "startingWith": [
          "0x"
      ]
  },
  {
      "chainId": 10,
      "chainSymbol": "matic20-test",
      "startingWith": [
          "0x"
      ],
      "chainName": "Polygon Test",
      "confirmations": 30,
      "hashLink": "https://mumbai.polygonscan.com/tx/",
      "node": 83,
      "nativeToken": 83,
      "networkId": 80001
  },
  {
      "chainId": 11,
      "chainSymbol": "okc",
      "chainName": "OKXChain Mainnet",
      "hashLink": "https://www.oklink.com/en/okc/tx/",
      "node": 83,
      "startingWith": [
          "0x"
      ],
      "networkId": -1,
      "nativeToken": -1
  },
  {
      "chainId": 12,
      "chainSymbol": "wemix 3.0",
      "chainName": "WEMIX 3.0",
      "hashLink": "https://explorer.wemix.com/tx/",
      "node": 508,
      "startingWith": [
          "0x"
      ]
  },
  {
      "chainId": 13,
      "chainSymbol": "arbitrum",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Arbitrum",
      "hashLink": "https://arbiscan.io/tx/",
      "node": 6,
      "startingWith": [
          "0x"
      ],
      "networkId": 42161,
      "nativeToken": 6
  },
  {
      "chainId": 14,
      "chainSymbol": "yota",
      "startingWith": [
          "0x"
      ],
      "chainName": "Playota",
      "confirmations": 30,
      "hashLink": "https://scan.playota.app/tx/",
      "node": 83,
      "nativeToken": -1,
      "networkId": 2222
  },
  {
      "chainId": 15,
      "chainSymbol": "ton",
      "addressRegex": "^[UE][Qf][0-9a-z-A-Z\\-\\_]{46}$|\\.tg",
      "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
      "chainName": "Toncoin"
  },
  {
      "chainId": 16,
      "chainSymbol": "base",
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
      "memoRegex": "",
      "chainName": "Base",
      "nativeToken": 6,
      "networkId": 8453
  },
  {
      "chainId": 17,
      "chainSymbol": "zkSync Era",
      "chainName": "zkSync Era",
      "confirmations": 30,
      "hashLink": "https://explorer.zksync.io/tx/",
      "node": -1,
      "nativeToken": 6,
      "networkId": -1,
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$"
  },
  {
      "chainId": 18,
      "chainSymbol": "linea",
      "chainName": "linea",
      "confirmations": 30,
      "hashLink": "https://explorer.linea.build/tx/",
      "node": -1,
      "nativeToken": 6,
      "networkId": -1,
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$"
  },
  {
      "chainId": 19,
      "chainSymbol": "Polygon zkEVM",
      "chainName": "Polygon zkEVM",
      "confirmations": 30,
      "hashLink": "https://zkevm.polygonscan.com/tx/",
      "node": -1,
      "nativeToken": 6,
      "networkId": -1,
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$"
  },
  {
      "chainId": 20,
      "chainSymbol": "mantle",
      "chainName": "Mantle",
      "confirmations": 30,
      "hashLink": "https://explorer.mantle.xyz/tx/",
      "node": -1,
      "nativeToken": 6,
      "networkId": -1,
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$"
  },
  {
      "chainId": 21,
      "chainSymbol": "manta",
      "chainName": "Manta",
      "confirmations": 30,
      "hashLink": "https://pacific-explorer.manta.network/tx/",
      "node": -1,
      "nativeToken": -1,
      "networkId": -1,
      "addressRegex": "^(0x)[0-9A-Fa-f]{40}$"
  },
  {
      "chainId": 10002,
      "chainSymbol": "btc",
      "addressRegex": "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
      "memoRegex": "",
      "chainName": "Bitcoin",
      "hashLink": "https://www.blockchain.com/btc/tx/",
      "node": 6
  }
]
