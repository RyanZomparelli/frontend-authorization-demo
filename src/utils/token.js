const TOKEN_KEY = "jwt";

// setToken takes a token as an argument and saves it to localStorage.
// setItem is a method of the global object window.localStorage.
// localStorage only takes strings.
// In our use case the token argument will come from the authorization request in
// the login handler.
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// getToken will check localStorage for the key, 'jwt'.
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// This will remove the JWT token when signing out in NavBar.
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
