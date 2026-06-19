# Progressive enhancement

Progressive enhancement is a way of building for the web that starts with a solid HTML foundation and layers CSS and JavaScript on top. Each layer improves the experience, but the core task remains completable even if a layer fails to load.

## The three layers

- **HTML**: the base. Functional enough on its own for the user to complete their core goal.
- **CSS**: adds visual presentation and makes the interface more comfortable to use.
- **JavaScript**: adds richer interactivity, client-side validation, and performance improvements.

## Why it matters

It's tempting to focus on what the latest browser APIs make possible. The risk is that as your focus shifts toward technology, it shifts away from users.

We can't know every device, browser, or network condition our users have. What we can do is build in a way that gives all users the greatest chance of success. Progressive enhancement is how we do that.

JavaScript and CSS are not guaranteed to load. Extensions block them, networks drop requests, and corporate proxies interfere. A user who can't complete a Melding because a script failed to load is a user we've let down — not because of their setup, but because of ours.

## Further reading

- [Why we use progressive enhancement to build GOV.UK](https://technology.blog.gov.uk/2016/09/19/why-we-use-progressive-enhancement-to-build-gov-uk/)
- [JavaScript isn't always available and it's not the user's fault — Adam Silver](https://adamsilver.io/blog/javascript-isnt-always-available-and-its-not-the-users-fault/)
