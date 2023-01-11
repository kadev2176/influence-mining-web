export const getTwitterUser = async (code: string) => {
  const res = await fetch(`http://localhost:8080/api/twitter/user?code=${code}`);
  const user = await res.json();
  return user;
}

export const getTwitterProfileImageUrl = async (address: string) => {
  return;
}
