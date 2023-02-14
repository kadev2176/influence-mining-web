// export const PARAMI_AIRDROP = 'https://airdrop.parami.io';
export const PARAMI_AIRDROP = 'https://staging.parami.io/airdrop';

// export const PARAMI_WALLET = 'https://app.parami.io';
export const PARAMI_WALLET = 'https://staging.parami.io';

// export const PARAMI_SUBQUERY = 'https://graph.parami.io';
export const PARAMI_SUBQUERY = 'https://staging.parami.io/graph/';

export const IM_SUBQUERY = 'https://staging.parami.io/airdrop/influencemining/api/graphql';

export const EIP5489ForInfluenceMiningContractAddress = '0x94F25955e84682BbE5301537f29442Ce1D5b7584'; // goerli

export const AD3ContractAddress = '0xf6b2923717175185a626790FF78B6f37DAbb3565'; // goerli

export const SignatureERC20WithdrawContractAddress = '0x6Abc172465AeD91D0B7b1C220454a474C826831F'; // goerli

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

export const BillboardLevel2Name: {[level: string]: string} = {
  '0': 'Novel',
  '1': 'Rare',
  '2': 'Premium',
  '3': 'Epic',
  '4': 'Legendary'
}

export const BillboardLevel2MiningPower: {[level: string]: number} = {
  '0': 20,
  '1': 50,
  '2': 100,
  '3': 200,
  '4': 400
}
