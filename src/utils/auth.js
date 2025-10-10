export const BASE_URL = "https://api.nomoreparties.co";

export const register = (username, password, email) => {
  return fetch(`${BASE_URL}/auth/local/register`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  }).then((res) => {
    return res.ok
      ? res.json()
      : Promise.reject(new Error(`Error: ${res.status}`));
  });
};
