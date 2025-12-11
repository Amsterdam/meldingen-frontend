const tokenStore = new Map<string, Tokens>();

type Tokens = {
  idToken: string,
  refreshToken: string,
}

export const saveTokens = (user: string, tokens: Tokens) => tokenStore.set(user, tokens);
export const getTokens = (user: string) => tokenStore.get(user);
export const deleteTokens = (user: string) => tokenStore.delete(user);
export const allTokens = () => Array.from(tokenStore.entries());
