# Directory structure

We follow these guidelines to keep our files and directories organised:

- **Local first**. When building components it’s best to keep the code that pertains only to that component, local.

Do this:

```lang-plaintext
/src
  /pages
    /page
      /components
        /ComponentA
          ComponentA.tsx
          ComponentA.test.tsx
      page.tsx
```

Instead of this:

```lang-plaintext
/src
  /components
    /ComponentA
      ComponentA.tsx
      ComponentA.test.tsx
  /pages
    /page
      page.tsx
```

- **Flatter is better**. Every time you nest you’re adding to the mental model required to grok a component’s local code.

Do this:

```lang-plaintext
/components
  ComponentA.tsx
  ComponentB.tsx
```

Instead of this:

```lang-plaintext
/components
  /ComponentA
    ComponentA.tsx
  /ComponentB
    ComponentB.tsx
```

- **Nest as you grow**. Flatter may be better, but there are reasons to nest.
  If a component has several files related to it, it makes sense to put these together in a directory.

Do this:

```lang-plaintext
/components
  /ComponentA
    ComponentA.tsx
    ComponentA.test.tsx
    useHookForComponentA.tsx
    index.ts
  ComponentB.tsx
```

Instead of this:

```lang-plaintext
/components
  ComponentA.tsx
  ComponentA.test.tsx
  useHookForComponentA.tsx
  ComponentB.tsx
```

- **Files are named after their main export**.
  This allows you to see at a glance what a file contains.
  A React component has a PascalCase file name, a JavaScript function has a camelCase file name, etc.

Do this:

```lang-plaintext
ComponentA.tsx
useHookForComponentA.tsx
```

Instead of this:

```lang-plaintext
component-a.tsx
use-hook-for-component-a.tsx
```
