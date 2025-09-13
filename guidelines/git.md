## Git guidelines

### Git basics

- **Clone a repo**: `git clone <repo-url>` — downloads the repository.
- **Check status**: `git status` — shows changed, staged, and untracked files.
- **Create/switch branch**: `git checkout -b <branch>` (new) or `git checkout <branch>` — moves to a branch.
- **Stage changes**: `git add <path>` or `git add .` — stages file(s) for commit.
- **Commit**: `git commit"` or `git commit -m "feat: concise message"` — records staged changes.
- **Pull**: `git pull origin <branch>` — pulls changes locally.
- **Push**: `git push origin <branch>` — uploads your branch and sets upstream.
- **Diff**: `git diff` or `git diff --staged` — shows what changed.
- **Log**: `git log --oneline --graph --decorate --all` — compact commit history.
- **Stash**: `git stash -u` — saves work-in-progress changes including untracked changes.
- **Pop**: `git stash pop` - retrieves last stashed work-in-progress

### When you're on a feature and need to review another branch

```bash
git stash -u                                  # stash tracked + untracked changes
git fetch origin                              # get all active branch references locally
git checkout <target-branch>                  # move to the branch to review
# ...review there are no breaking changes... 
# ...sign off on PR... 
git checkout <your-branch>                    # return to your feature branch
git stash pop                                 # restore your work (resolve any conflicts)
```

### Finishing a feature branch
> Only pull main once your ready to push that way you only merge one time

```bash
git add .                                      # stage changes to feature branch
git commit                                     # commit changes
git checkout main                              # go to main
git pull origin main                           # update main
git checkout <your-branch>                     # back to your feature
git merge main                                 # bring latest main to your feature
# resolve conflicts if any, then:
git push origin <your-branch>                  # push changes to your feature
# open a PR on your repo host and get approvals
# after merge, delete branch then:
git checkout main                              # return to main
git pull origin main                           # pull changes
git branch -d <your-branch>                    # delete local branch
```

### Maintenance

```bash
# remove deleted remote branch references
git fetch --prune   

# delete all local branches except main:
git branch -D $(git branch --list --no-color | grep -v "^*" | grep -v "main")
```