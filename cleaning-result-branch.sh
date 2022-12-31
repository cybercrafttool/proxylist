#!/bin/bash
rm -rf .git
git init
git config --global --add safe.directory /github/workspace
git config --local user.email "binsarjr121@gmail.com"
git config --local user.name "binsarjr"
git config --global --add safe.directory /github/workspace
echo "*" > .gitignore
echo "!*.txt" >> .gitignore
# rm package.json
# rm pnpm*
# rm grabber
# .gitignore



git add -A

d=`date '+%Y-%m-%dT%H:%M:%SZ'`
git commit -m "$d"