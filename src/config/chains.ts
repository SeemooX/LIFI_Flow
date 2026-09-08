import type { Chain } from "../types/appTypes";

export const CHAINS: Chain[] = [
  {
    id: "eth",
    chainId: 1,
    name: "Ethereum",
    color: "#627EEA",
    symbol: "Ξ",
    tokens: [
      {
        symbol: "ETH",
        name: "Ether",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
      },
      {
        symbol: "DAI",
        name: "Dai",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: 18,
      },
      {
        symbol: "WBTC",
        name: "Wrapped BTC",
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimals: 8,
      },
    ],
  },

  {
    id: "base",
    chainId: 8453,
    name: "Base",
    color: "#0052FF",
    symbol: "B",
    tokens: [
      {
        symbol: "ETH",
        name: "Ether",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
      },
      {
        symbol: "DAI",
        name: "Dai",
        address: "0x50c5725949A6F0c72E6C4a641F24049A0eF4b3f",
        decimals: 18,
      },
    ],
  },

  {
    id: "pol",
    chainId: 137,
    name: "Polygon",
    color: "#8247E5",
    symbol: "P",
    tokens: [
      {
        symbol: "MATIC",
        name: "Polygon",
        address: "0x0000000000000000000000000000000000001010",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimals: 6,
      },
      {
        symbol: "DAI",
        name: "Dai",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimals: 18,
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
      },
    ],
  },

  {
    id: "arb",
    chainId: 42161,
    name: "Arbitrum",
    color: "#12AAFF",
    symbol: "A",
    tokens: [
      {
        symbol: "ETH",
        name: "Ether",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xFd086bC7CD5C481dcc9C85ebe478A1C0b69FCbb9",
        decimals: 6,
      },
      {
        symbol: "ARB",
        name: "Arbitrum",
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        decimals: 18,
      },
    ],
  },

  {
    id: "opt",
    chainId: 10,
    name: "Optimism",
    color: "#FF0420",
    symbol: "O",
    tokens: [
      {
        symbol: "ETH",
        name: "Ether",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        decimals: 6,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0x94b008aA00579c1307B0EF2c499AD98a8ce58e58",
        decimals: 6,
      },
      {
        symbol: "DAI",
        name: "Dai",
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        decimals: 18,
      },
      {
        symbol: "OP",
        name: "Optimism",
        address: "0x4200000000000000000000000000000000000042",
        decimals: 18,
      },
    ],
  },

  {
    id: "sol",
    chainId: 1151111081099710,
    name: "Solana",
    color: "#9945FF",
    symbol: "S",
    tokens: [
      {
        symbol: "SOL",
        name: "Solana",
        address: "11111111111111111111111111111111",
        decimals: 9,
      },
      // Add USDC, USDT, RAY here with their Solana mint addresses.
    ],
  },
];

export const CHAIN_MAP = Object.fromEntries(
  CHAINS.map((chain) => [chain.id, chain])
);