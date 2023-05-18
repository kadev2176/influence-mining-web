import { IPFS_UPLOAD_ENDPOINT } from "../models/parami";

export const uploadIPFS = async (obj: unknown) => {
  const bufferred = await Buffer.from(JSON.stringify(obj)) as any;

  const formData = new FormData();
  formData.append('file', bufferred);

  const resp = await fetch(`${IPFS_UPLOAD_ENDPOINT}`, {
    method: 'POST',
    body: formData
  })

  if (!resp.ok) {
    // error handling
    return;
  }

  return resp.json();
};