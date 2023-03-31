export const config = {
  "socketServer": "wss://staging.parami.io/ws",
  "types": {
    "Public": "MultiSigner",
    "LookupSource": "MultiAddress",
    "Address": "MultiAddress",
    "ChainId": "u32",
    "DepositNonce": "u64",
    "ClassId": "()",
    "TokenId": "()",
    "TAssetBalance": "u128",
    "NativeBalance": "Balance",
    "SwapAssetBalance": "TAssetBalance",
    "SwapPair": {
      "account": "AccountId",
      "nativeReserve": "Balance",
      "assetReserve": "TAssetBalance"
    },
    "TagType": "u8",
    "TagScore": "i8",
    "TagCoefficient": "u8",
    "GlobalId": "u64",
    "AdvertiserId": "GlobalId",
    "AdId": "GlobalId",
    "Advertiser": {
      "createdTime": "Compact<Moment>",
      "advertiserId": "Compact<AdvertiserId>",
      "deposit": "Compact<Balance>",
      "depositAccount": "AccountId",
      "rewardPoolAccount": "AccountId"
    },
    "Advertisement": {
      "createdTime": "Compact<Moment>",
      "deposit": "Compact<Balance>",
      "tagCoefficients": "Vec<(TagType, TagCoefficient)>",
      "signer": "AccountId",
      "mediaRewardRate": "Compact<PerU16>"
    },
    "AdvertiserOf": "Advertiser",
    "AdvertisementOf": "Advertisement",
    "StableAccountOf": "StableAccount",
    "StableAccount": {
      "createdTime": "Compact<Moment>",
      "stashAccount": "AccountId",
      "controllerAccount": "AccountId",
      "magicAccount": "AccountId",
      "newControllerAccount": "Option<AccountId>"
    }
  },
}

export default config;