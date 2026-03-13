/**
 * Token Storage Wrapper.
 * SImple abstraction for managing auth tokens in localStorage.
 */
const TOKEN_KEY = 'examora_token';

const storage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearStorage: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export default storage;
