echo Hello
call git status
call git checkout gh-pages
call git rebase master 
call git push -f gh-pages 
call git checkout master 
PAUSE