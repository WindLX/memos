# Frontend Fork Maintenance Guide

This guide is for maintaining a personal fork focused on frontend customization while keeping in sync with upstream.

## Remote Strategy

- origin: your fork repository
- upstream: official source repository

Verify:

```bash
git remote -v
```

Expected:

- origin -> git@github.com:WindLX/memos.git
- upstream -> git@github.com:usememos/memos.git

## Branch Strategy

- main: sync-only branch, always close to upstream/main
- frontend-custom: your long-lived customization branch

Create the working branch once:

```bash
git checkout -b frontend-custom
git push --force-with-lease origin frontend-custom
```

## Daily Frontend Workflow

```bash
git checkout frontend-custom
# make frontend changes
cd web
pnpm lint
pnpm build
cd ..
git add web docs/frontend-fork-maintenance.md
git commit -m "feat(web): your change summary"
git rebase main
git push --force-with-lease origin frontend-custom
# upload to my server
cd ..
./scripts/release_and_deploy.sh
```

## Upstream Sync Workflow (Recommended Weekly)

1. Sync local main with upstream/main.
2. Rebase frontend-custom on top of the updated main.
3. Force-push safely with lease.

```bash
git fetch upstream
git checkout main
git merge --ff-only upstream/main
git push origin main

git checkout frontend-custom
git rebase main
git push --force-with-lease
```

## Conflict Resolution Policy (Frontend-Focused)

- Prefer your changes in web/** when conflicts are expected customization edits.
- Prefer upstream for backend and infrastructure paths unless you intentionally changed them.
- After resolving conflicts, always run frontend checks:

```bash
cd web
pnpm lint
pnpm build
```

## Notes

- Keep commits focused on frontend scope for easier rebases.
- Avoid committing generated files outside your intended scope.
- If upstream introduces large frontend refactors, sync more frequently to reduce conflict size.