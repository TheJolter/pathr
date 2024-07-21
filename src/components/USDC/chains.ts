export type EvmChain = {
  chainID: string;
  chainName: string;
  rpc: string;
  domain: number;
  usdcAddress: string;
  logo?: string;
  chainType: 'evm',
  tokenType: 'erc20',
  tokenMessenger: string,
  explorer: string,
}

export type CosmosChain = {
  chainID: string;
  chainName: string;
  rpc: string;
  lcd: string;
  domain: number;
  usdcAddress: string;
  logo?: string;
  chainType: 'cosmos',
  tokenType: 'native' | 'ibc',
  prefix: string,
  explorer: string,
  nativeToken: string,
}

export type Chain = EvmChain | CosmosChain;

export const chains:Chain[] = [
  {
    chainID: '0x1',
    chainName: 'Ethereum',
    rpc: 'https://rpc.ankr.com/eth',
    domain: 0,
    usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    chainType: 'evm',
    tokenType: 'erc20',
    tokenMessenger: '0xbd3fa81b58ba92a82136038b25adec7066af3155', // https://developers.circle.com/stablecoins/docs/evm-smart-contracts#tokenmessenger-mainnet
    explorer: 'https://etherscan.io',
  },
  {
    chainID: '0xa86a',
    chainName: 'Avalanche',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    domain: 1,
    usdcAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    chainType: 'evm',
    tokenType: 'erc20',
    tokenMessenger: '0x6b25532e1060ce10cc3b0a99e5683b91bfde6982',
    explorer: 'https://snowtrace.io',
  },
  {
    chainID: '0xa4b1',
    chainName: 'Arbitrum',
    rpc: 'https://arb1.arbitrum.io/rpc',
    domain: 3,
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    chainType: 'evm',
    tokenType: 'erc20',
    tokenMessenger: '0x19330d10D9Cc8751218eaf51E8885D058642E08A',
    explorer: 'https://arbiscan.io',
  },
  {
    chainID: 'joltify_1729-1',
    chainName: 'Joltify',
    rpc: 'https://rpc.joltify.io',
    lcd: 'https://lcd.joltify.io',
    domain: -1, // means ibc
    usdcAddress: 'ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3',
    chainType: 'cosmos',
    tokenType: 'ibc',
    prefix: 'jolt',
    explorer: 'https://explorer.joltify.io/joltify',
    nativeToken: 'ujolt',
  },
  {
    chainID: 'noble-1',
    chainName: 'Noble',
    rpc: 'https://noble-rpc.polkachu.com',
    lcd: 'https://noble-api.lavenderfive.com',
    domain: 4,
    usdcAddress: 'uusdc',
    chainType: 'cosmos',
    tokenType: 'native',
    prefix: 'noble',
    explorer: 'https://www.mintscan.io/noble', // /accounts/address, /transactions/txhash
    nativeToken: 'uusdc',
  },
]