# Authentication

## Login

- On the landing page a user should be able to click de login button of the provider and be redirected to the provider
- When credentials are submitted the user is redirected to the application's home page
- A session cookie is stored in the browser

## Authorize

- With the `useAuthenticatedFetch` hook a user is able to authorize fetch requests to a provided url
- When successful, an accessToken of the provider is added as Authorization header in the request
- When no session exists, a "No session found" error should be thrown
- When a response is unsuccessful a new error should be thrown with the response.statusText
