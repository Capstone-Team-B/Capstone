# Github flow
1. Make sure your work on your feature branch is committed.
  
    `git add .`
    
    `git commit -m "Your commit message"`

2. Switch to the main branch.

      `git checkout main`

3. Pull the latest changes from the remote main branch.

    `git pull origin main`

4. Switch back to your feature branch.

    `git checkout your-feature-branch`

5. Rebase your feature branch onto the main branch to integrate the changes you just pulled. This will place your feature branch commits on top of the main branch commits, making it easier to merge later.

    `git rebase main`

6. Resolve any conflicts that may occur during the rebase process. After resolving conflicts, stage the changes, and continue the rebase.

    `git add .`

    `git rebase --continue`

7. Push your changes to your remote feature branch.

    `git push origin your-feature-branch`

8. Create a pull request from your feature branch to the main branch (in Github).

9. Wait for the PR to be reviewed and approved by a teammate.

10. Once the PR is approved, merge it into the main branch. 

# Github flow for a Node.js project (unprotected)

1. Make sure your work on your feature branch is committed.
  
    `git add .`
    
    `git commit -m "Your commit message"`

2. Switch to the main branch.

      `git checkout main`

3. Pull the latest changes from the remote main branch.

    `git pull origin main`

4. Switch back to your feature branch.

    `git checkout your-feature-branch`

5. Rebase your feature branch onto the main branch to integrate the changes you just pulled. This will place your feature branch commits on top of the main branch commits, making it easier to merge later.

    `git rebase main`

6. Resolve any conflicts that may occur during the rebase process. After resolving conflicts, stage the changes, and continue the rebase.

    `git add .`

    `git rebase --continue`

7. Repeat step 6 for any other conflicts that occur during the rebase process. Once all conflicts are resolved and the rebase is complete, switch back to the main branch.

   `git checkout main`

8. Merge your feature branch into the main branch.

   `git merge your-feature-branch`

9. Push the updated main branch to the remote repository.

    `git push origin main`

10. Now, each group member should pull the updated main branch to their local repository to get the latest changes.

    `git checkout main`

    `git pull origin main`

11. Check functionality before the next teammate starts a merge:

    `npm install`
     
     `npm run seed`
   
    `npm run start-dev`

11. If other members have unmerged feature branches, they should now rebase their feature branches onto the updated main branch (steps 5-7) before merging them into the main branch (steps 8-9).
