# Forms

Meldingen revolves for a large part around forms.
Our Admin app allows admins to create and update forms, which are shown in our Melding Form and Back Office apps.

## Guidelines

We follow [NL Design System’s form guidelines](https://nldesignsystem.nl/richtlijnen/formulieren/).

## Schema

To make dealing with forms easier, we use the [Form.io](https://form.io/) JSON schema.
Form.io uses a relatively simple schema, which our back-end can also use.

In the Admin application, we use Form.io’s [Builder](https://help.form.io/developers/form-development/form-builder) to build forms.

We tried to use Form.io’s Renderer in the Melding Form application, but it didn’t integrate well with Next.js and server-side rendering.
So we built [our own renderer](/libs/form-renderer), which uses the same schema.
