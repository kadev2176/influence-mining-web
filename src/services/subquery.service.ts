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
