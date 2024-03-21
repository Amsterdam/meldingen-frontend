<!-- @license CC0-1.0 -->

# Style code conventions

## Component level styling

We [decided to use CSS Modules](../adr//0004-styling.md) for our component level styling.

### File naming

Add the `*.module.css` file to the component folder.
Give the css file the same name as the component, so it’s easier to find in your IDE.
For example:

```text
libs
├── ui
|   ├── src
|   │   ├── Button
|   │   │   ├── Button.tsx
|   │   │   ├── Button.module.css
```

### Composition

We use [CSS Modules’ composition feature](https://github.com/css-modules/css-modules/blob/master/docs/composition.md)
to reuse styles.
This way, CSS Modules prevents redundant code. For example, this:

```css
.base {
  /* base button styles */
}

.primary {
  composes: base;
  /* extra primary button styles */
}

.secondary {
  composes: base;
  /* extra secondary button styles */
}
```

...generates the following classes, where the first class contains the specific secondary button styles,
and the second class contains the reused base button styles:

```text
Button_secondary__9ex2D Button_base__aIT_t
```

### Don't affect the layout outside your component

In order to keep components side-effects free, don’t specify layout outside your component.
In other words: components shouldn’t set their outside `margin`.
Layout should be handled by the grid and spacing system.

### Use camelCase for local class names

From the [CSS Modules docs](https://github.com/css-modules/css-modules/blob/master/docs/naming.md):
use camelCase for local class names. This makes them easier to use in a JavaScript context.

## Other conventions

### Define `margin` and `padding` the modern way

The layout should work equally well in pages with right-to-left text direction for Arabic script,
as in pages with left-to-right text for typical European languages and Latin script.
This means using `-left` and `-right` is best avoided in many cases,
because the values would need to be inversed for the other text direction.

CSS now offers alternatives that work for all text directions, and are inversed automatically depending on the context.
The new method also makes `-top` and `-bottom` obsolete,
because the new CSS properties are also agnostic for the [vertical text direction in East Asian scripts](https://en.wikipedia.org/wiki/Horizontal_and_vertical_writing_in_East_Asian_scripts).

For pages with Latin scripts you should use the following alternatives:

- `margin` and `padding` shorthand should not be used
- `*-top` becomes `*-block-start`
- `*-right` becomes `*-inline-end`
- `*-bottom` becomes `*-block-end`
- `*-left` becomes `*-inline-start`
- You can combine `-top` and `-bottom` with `*-block`
- You can combine `-left` and `-right` with `*-inline`

### Only use relative size units

Users can change the base font size from the default size to something bigger or smaller.
Using `px` values in your css can break this functionality.
Therefore, (almost) always use relative sizes, `rem` often being the most convenient.
Only use `px` values if you specifically do not want something to become bigger or smaller
when the user changes the base font size.

### Avoid short-hand properties that unintentionally override properties

```css
.example-card {
  background: url('image.jpg');
}
```

In this example you can use `background-image` instead of `background`,
and avoid resetting properties that might be defined elsewhere, such as `background-repeat` or `background-color`.

The same goes for `margin` in the following example:

```css
ul {
  margin: 0;
}
```

This example code is only used to reset the browsers' built-in stylesheet for vertical margin.
You can make the reset stylesheet more specific like this, with the same effect:

```css
ul {
  margin-block-start: 0;
  margin-block-end: 0;
}
```

### Name things after their purpose, not after the visual design

Do not use the visual design in the naming of class names:

```css
.example-badge--maroon {
  color: maroon;
}
```

Name the class name after the purpose instead:

```css
.example-badge--danger {
  color: maroon;
}
```
