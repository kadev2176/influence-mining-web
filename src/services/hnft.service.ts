export const ownsHNFT = async (address: string) => {
  return false;
}

export const getHNFT = async (address: string) => {
  return null;
  return {
    contractAddress: '',
    tokenId: '',
    image: ''
  }
}

export const mintHNFT = async () => {
  return {
    contractAddress: '0xabc',
    tokenId: '123',
    image: 'https://i.seadn.io/gcs/files/6d667cc80864a5f3ccaec88a494343db.png?auto=format&w=384'
  }
}