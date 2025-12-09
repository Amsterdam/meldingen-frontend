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
Locally, we use Keycloak for this.
If you have the back end running on your machine, you can log in with `meldingen_user` and `password`.

For the deployed instance of the Admin app, we use Entra ID.
Entra ID is used when the environment variables `VITE_ENTRA_APP_BASE_URL`, `VITE_ENTRA_AUTHORITY` and `VITE_ENTRA_CLIENT_ID` are set.

If any of these variables are not set, the application will revert to Keycloak authentication.
When configured properly, you should be able to log in automatically if you access the Admin app from a workspace with the necessary permissions.

[See here](https://gemeente-amsterdam.atlassian.net/wiki/spaces/TS/pages/2359492609/Authenticatie+in+V2) for more technical details.

## Back office

Our Back office app also requires that you log in before you can use it.
Locally, we use Keycloak for this.
If you have the back end running on your machine, you can log in with `meldingen_user` and `password`.

For the deployed instance of the Back office app, we use Entra ID.
Entra ID is used when the environment variables `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, `ENTRA_TENANT_ID` and `ENTRA_TOKEN_URL` are set.

If any of these variables are not set, the application will revert to Keycloak authentication.
When configured properly, you should be able to log in automatically if you access the Back office app from a workspace with the necessary permissions.

[See here](https://gemeente-amsterdam.atlassian.net/wiki/spaces/TS/pages/2359492609/Authenticatie+in+V2) for more technical details.
