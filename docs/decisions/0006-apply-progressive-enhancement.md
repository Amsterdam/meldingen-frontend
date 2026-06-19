# Apply progressive enhancement

## Status

Accepted on 24-03-2025

## Context

We want users to be able to submit a Melding regardless of their device, browser, or network conditions. JavaScript and CSS are not guaranteed: they may fail to load, be blocked by a browser extension, or simply be unavailable. Building on a solid HTML foundation ensures the core task — submitting a Melding — remains possible even when the enhancement layers don't load.

## Options

- **Progressive enhancement**: start with functional HTML, layer CSS for presentation, layer JavaScript for additional functionality.
- **JavaScript-first**: require JavaScript for the application to function, as is common in single-page applications.

## Decision

We use progressive enhancement in the Melding Form and Back Office apps, with different levels of strictness:

- **Melding Form**: full progressive enhancement. Users must be able to submit a Melding with no CSS and no JavaScript.
- **Back Office**: partial progressive enhancement. Most functionality should still work without CSS and JavaScript, but we are less strict here because Back Office users are internal and work in more controlled environments.
- **Admin app**: no progressive enhancement, the Admin app is a single-page application. The Admin app only has a handful of users and lack of availability is less of an issue.

## Consequences

- The Melding Form is usable in the widest possible range of conditions, including assistive technologies and low-bandwidth environments.
- Server-side rendering and standard HTML form submission must cover the core user journey in the Melding Form.
- JavaScript enhancements (client-side validation, dynamic UI) are additions on top of a working base, not prerequisites.
- There is more of a learning curve for new developers who are used to single-page applications.

## References

- [Progressive enhancement guide](../guides/progressive-enhancement.md)
