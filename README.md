Archived
======
Tech Leads: Repository archived due to inactivity in more than 6 months.
Please remember to add a CODEOWNERS file to the root of the repository when unarchiving.

# lunchbot

Crawl all the lunch menus!

## Environment variables

*PORT* - defaults to 3000

*SLACK_SLASH_LUNCH* - Slack security token

## How to run

```sh
docker build -t lunchbot:latest .

docker run --detach --name lunchbot --publish <hostPort>:3000 --env SLACK_SLASH_LUNCH=<slackToken> lunchbot:latest
```
