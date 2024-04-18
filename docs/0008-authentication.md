# Authentication

Both our Admin and Backoffice apps require that you log in before you can use them.
To facilitate this, we use [NextAuth.js](https://next-auth.js.org/).

NextAuth.js is free and open source, and it has support for several popular authentication services.
This makes it a good choice for use in an open source application which is used by other municipalities.

We intend to implement NextAuth.js in a way that’s configurable,
so other municipalities can use their own authentication service(s).

The base implementation uses [Keycloak](https://www.keycloak.org/).

NextAuth.js is specifically intended for use with [Next.js](https://nextjs.org/),
which means the Admin and Backoffice apps have to use Next.js as well.
NextAuth.js intends to move towards a generic solution, [Auth.js](https://authjs.dev/).
When that project is stable and mature enough, we can consider migrating to it.
