# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

When you make a change to a package that should be released, run:

```bash
pnpm changeset
```

and follow the prompts to describe the change (patch / minor / major) and write a
short summary. Commit the generated markdown file alongside your change. On merge,
the release workflow uses these files to version and publish the affected packages.
