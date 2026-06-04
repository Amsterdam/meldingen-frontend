# Styling

We use [CSS Modules](https://github.com/css-modules/css-modules) for styling, following our [organisation's recommendation](https://developers.amsterdam/docs/frontend/languages-and-frameworks/). It stays close to vanilla CSS and has built-in support in Next.js.

## File naming

Add the `*.module.css` file to the component folder.
Give the CSS file the same name as the component, so it’s easier to find in your IDE.
For example:

```text
libs
├── ui
|   ├── src
|   │   ├── Button
|   │   │   ├── Button.tsx
|   │   │   ├── Button.module.css
```

## Class names

Use camelCase for class names. [This makes them easier to reference in JavaScript](https://github.com/css-modules/css-modules/blob/master/docs/naming.md).

Name classes after their purpose, not their visual appearance:

```css
/* Wrong */
.badgeMaroon {
  color: maroon;
}

/* Right */
.badgeDanger {
  color: maroon;
}
```

## Composition

Use [CSS Modules’ composition feature](https://github.com/css-modules/css-modules/blob/master/docs/composition.md)
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

## Don't affect layout outside the component

Components should not set their own `margin`. Layout is the responsibility of the parent — use the grid and spacing system instead. This keeps components side-effect free.

## Use logical properties

Use CSS logical properties instead of physical direction keywords. They adapt automatically to right-to-left and vertical writing modes:

| Avoid                          | Use instead           |
| ------------------------------ | --------------------- |
| `margin-top`                   | `margin-block-start`  |
| `margin-bottom`                | `margin-block-end`    |
| `margin-left`                  | `margin-inline-start` |
| `margin-right`                 | `margin-inline-end`   |
| `margin-top` + `margin-bottom` | `margin-block`        |
| `margin-left` + `margin-right` | `margin-inline`       |

The same applies to `padding` and other properties with directional variants.

## Use relative size units

Use `rem` (or other relative units) rather than `px`. Users can change their browser's base font size; `px` values ignore that preference. Only use `px` when you explicitly want a value that does not scale with the user's font size setting.

## Prefer specific properties over shorthand

Shorthand properties reset all sub-properties, including ones you may not intend to change. Use the specific property instead:

```css
/* Wrong — resets background-color, background-repeat, etc. */
.card {
  background: url('image.jpg');
}

/* Right */
.card {
  background-image: url('image.jpg');
}
```

```css
/* Wrong when wanting to reset only vertical margins — resets both block and inline margins */
ul {
  margin: 0;
}

/* Right */
ul {
  margin-block: 0;
}
```
