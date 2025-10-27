# Session management and authentication

## Melding form

When a melder submits a melding text, the back end returns a melding id and a token.
We store these in a cookie and use them to identify that subsequent posts are part of the same melding.
We’ve chosen cookies over JavaScript storage, because cookies are a more robust solution.
If the melder refreshes the page or if JavaScript fails to load correctly, cookies will still function.

The cookies expire after 1 day. This means that if you do not complete a melding in 1 day,
your session will not longer be valid. This is in line with municipal guidelines.
Currently, the back end invalidates a token after 3 days.
We should probably change this to 1 day to match the cookie expiration.

When a melder finishes a melding, the cookies are removed.
After that, the melder can go back to the first form page to start a new session.

If a melder does not finish a melding, they will stay in the same session for 1 day,
even if they close the browser or open the page in a new tab.
It’s always possible to return to the first page and modify the melding text and category,
but it will still be associated with the same melding id.

## Admin

Our Admin requires that you log in before you can use it.
We use [React Admin's Keycloak provider](https://github.com/marmelab/ra-keycloak) for this.
We intend to create a wrapper around this provider, so other users can use their own authentication provider.
