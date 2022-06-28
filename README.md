# Game Trailer Stats

Small side project to work with GitHub Actions/Pages and Next.js (and Prisma as a bonus).

## Motivation

Besides trying new technologies like Next.js and GH Actions/Pages I wanted to get an overview of the popularity of upcoming game titles. This was motivated by the fact that the Twitter algorithm decided that I am interested in console bashing and therefore only provides highly opinionated tweets why console X is better than Y because of the number of exclusives and number of games in their subscription services.

This project should provide an overview of upcoming AAA games (either developed by an AAA studio or promoted by an AAA publisher) with data acquired by the YouTube Data API (e.g. views, likes, and comments on the official trailers).

It should be easy to add new trailers to expand the list.

Although this project tries to counter some of the console bashing arguments, the list it uses is opinionated by my own game preferences.

## How it works

This project generates static sites based on the games/trailers listed in the `data/trailers.json`. As this project doesn't have a running database for the statistics, it uses the GitHub Action `services` in the CI to boot up a `PostgreSQL` during the crawl and build steps. Therefore it persists the `pg_dump` as a SQL file to keep the repo diffs small (compared to binary files like `sqlite`).

The crawler runs every day and updates the trailers in the database and fetches the newest data from YouTube. The updated `trailers.json` and `data.sql` are pushed to the `main` branch to persist the updated values. This triggers the `build` workflow which builds the Next.js static pages and uploads them to GitHub Pages eventually.

New trailers can be added by editing the `trailers.json` in the `data` folder. A new trailer object must contain the following properties:
* gameTitle
* youtubeId (the last part of the URL after `watch?v=...`)
* categories (see previous entries for available categories)
* gameUrl (a link to the international page of the Game; if no international page exits use an en-US one)
* releaseDate (optional; a string in the format `YYYY-MM-DD`, do not provide this property when there is no release date yet)

New trailer entires must not have a `id` since the id is generated and persisted during the crawl job.

## TODOs
- [ ] Styling
- [x] Get 50+ trailers
- [ ] Interactive charts
- [ ] Port crawler to TypeScript
- [ ] Make a list of pre-defined categories and determine naming (e.g. "Xbox Series X" vs. "XSX" or "Uplay" vs. "Ubisoft Connect")
- [ ] Figure out a category for exclusives (e.g. "Exclusive", "PS Exclusive", ...)
- [ ] Look out for [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) and [actions/deploy-pages](https://github.com/actions/deploy-pages) releases (automated with [dependabot](/.github/dependabot.yml))
