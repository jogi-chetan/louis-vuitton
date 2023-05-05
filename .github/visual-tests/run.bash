#!/usr/bin/env bash
GITHUB_ENV=env.txt
GITHUB_STEP_SUMMARY=summary.txt
github.head_ref=ui-tests
#set -x

# TODO: get dynamically from config
export DOMAIN1='main--vg-volvotrucks-us--hlxsites.hlx.live'
export DOMAIN2='${{ github.head_ref }}--vg-volvotrucks-us--hlxsites.hlx.live'
#npx playwright test | tee playwright.log

if grep "$DOMAIN2" playwright.log; then
  echo "Diffs found"
  SUMMARY="### :small_orange_diamond: Visual differences detected: :zap:
  $(grep "$DOMAIN2" playwright.log)

  See also diff image [in attached screenshots](${ GITHUB_SERVER_URL }/${ GITHUB_REPOSITORY }/actions/runs/${ GITHUB_RUN_ID })
  "

  echo $SUMMARY
  exit 1

  echo "$SUMMARY" >> "$GITHUB_STEP_SUMMARY"

  # using multi-line-vars from  https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-a-multiline-string
  EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
  echo "SUMMARY<<$EOF" >> "$GITHUB_ENV"
  echo "$SUMMARY" "$GITHUB_ENV"
  echo "$EOF" >> "$GITHUB_ENV"
else
  echo "No diffs found"
  echo "No diffs found" >> "$GITHUB_STEP_SUMMARY"
  echo "SUMMARY=" >> "$GITHUB_ENV"
fi

echo "env:"
cat "$GITHUB_ENV"
