// export const PARAMI_AIRDROP = 'https://airdrop.parami.io';
export const PARAMI_AIRDROP = 'https://staging.parami.io/airdrop';

// export const PARAMI_WALLET = 'https://app.parami.io';
export const PARAMI_WALLET = 'https://staging.parami.io';

// export const PARAMI_SUBQUERY = 'https://graph.parami.io';
export const PARAMI_SUBQUERY = 'https://staging.parami.io/graph/';

export const IPFS_UPLOAD_ENDPOINT = 'https://ipfs.parami.io/api/v0/add?stream-channels=true';

export const EIP5489ForInfluenceMiningContractAddress = '0x94F25955e84682BbE5301537f29442Ce1D5b7584'; // goerli

export const AD3ContractAddress = '0xf6b2923717175185a626790FF78B6f37DAbb3565'; // goerli

export const AuctionContractAddress = '0x6023cF66B0AD3e79D942c2a66B368C921632D1c2'; // goerli

export const HNFTGovernanceContractAddress = '0x7c3826180814518C7d7765b1ECE11eDB708a7850'; // goerli

export const SignatureERC20WithdrawContractAddress = '0x715d19366fb1406010adcE72232080eABc167545'; // goerli

export enum AD3TxType {
  DEPOSITE_WITHDRAWABLE = 'deposit_withdrawable',
  DEPOSITE_LOCKED = 'deposit_locked'
}

export enum POST_MESSAGE {
  NFT_IMPORTED = 'ParamiWallet::ImportSuccess',
  AD_BID = 'ParamiWallet::BidSuccess',
  NFT_MINT = 'ParamiWallet::NftMintSuccess',
  ADD_LIQUIDITY = 'ParamiWallet::AddLiquidity',
  IM_POOL_CREATED = 'ParamiWallet::IMPoolCreated'
}

export const BillboardLevel2Name: { [level: string]: string } = {
  '0': 'Novel',
  '1': 'Rare',
  '2': 'Premium',
  '3': 'Epic',
  '4': 'Legendary'
}

export const BillboardLevel2MiningPower: { [level: string]: number } = {
  '0': 20,
  '1': 50,
  '2': 100,
  '3': 200,
  '4': 400
}

export const HNFT_CONFIG = [
  {
    level: 0,
    rank: 'Novel',
    name: 'Novel Billboard',
    boost: 'X2',
    price: '0'
  },
  {
    level: 1,
    rank: 'Rare',
    name: 'Rare Billboard',
    boost: 'X5',
    price: '0.3'
  },
  {
    level: 2,
    rank: 'Premium',
    name: 'Premium Billboard',
    boost: 'X10',
    price: '1.2'
  },
  {
    level: 3,
    rank: 'Epic',
    name: 'Epic Billboard',
    boost: 'X20',
    price: '4.8'
  },
  {
    level: 4,
    rank: 'Legendary',
    name: 'Legendary Billboard',
    boost: 'X40',
    price: '19.2'
  }
];

export const OFFICIAL_TAG = '#GPTMiner';
