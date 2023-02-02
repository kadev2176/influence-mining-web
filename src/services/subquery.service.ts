import { PARAMI_SUBQUERY } from "../models/parami";

export const doGraghQuery = async (query: string) => {
  const obj: any = {};
  obj.operationName = null;
  obj.variables = {};
  obj.query = query;
  return fetch(PARAMI_SUBQUERY, {
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify(obj),
    "method": "POST"
  });
};

export const getNFTIdsOfOwnerDid = async (did: string) => {
  try {
    const query = `query {
    nfts(
      filter: { kolDid: { equalTo: "${did}" } }
    ) {
      nodes {
        id
      }
    }
  }`;
    const res = await doGraghQuery(query);

    // Network exception
    if (!res) {
      return;
    }

    const data = await res.json();
    return data.data.nfts.nodes.map((node: { id: string }) => node.id) as string[]

  } catch (e) {
    console.error(e)
    return;
  }
}

export const getBillboardList = async () => {
  return new Promise((res, rej) => {
    res([
      {
        nftId: '1001',
        adId: '123',
        price: '5000000000000000000',
        influence: 742,
        imageUrl: 'https://i.seadn.io/gcs/files/9008e1ff76a030fd412be9850badd3e9.png?auto=format&w=1000'
      },
      {
        nftId: '1002',
        adId: '333',
        price: '8000000000000000000',
        influence: 1200,
        imageUrl: 'https://i.seadn.io/gcs/files/3b34b743096f0e5c201c3a7b38e1f795.png?auto=format&w=1000'
      },
    ])
  })
}

export const getActiveBidNftIds = async (account: string) => {
  // todo: account / did
  //   query
  // {
  //   advertisementBids(
  //     filter: {
  //       and: [{advertiser: {equalTo: "0xdcc6ff43e5b0b7b636517ac1493d9937d0169f08b54ade880d55d5074b9f5efa"}}, {active: {equalTo: true}}]
  //     }
  //   ){
  //     nodes {
  //       id,
  //       nftId
  //     }
  //   }
  // }
  // return ['42'];

  return new Promise((r) => r(['42'] as string[]))
}

// query my active bids
// let adIds = query
// {
//   advertisements(
//     filter: {advertiser: {equalTo: "2JvopjhZ2tTnXFqWDzewYigtYSgd"}}
//   ){
//     nodes {
//       id
//     }
//   }
// }

// 5CnkM4pvdnSyrpng5bFaCkeYTsPybpRTWzkkMc2tMbAJXjoa

// let res = query
// {
//   advertisementBids(
//     filter: {advertisementId: {in: "adIds"}}
//   ){
//     nodes {
//       id
//     }
//   }
// }
