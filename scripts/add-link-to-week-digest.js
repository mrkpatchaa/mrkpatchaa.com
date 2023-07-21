require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const REPO = "mrkpatchaa.com";
const REPO_OWNER = "mrkpatchaa";

// Authenticate using a personal access token
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function addLink() {
  try {
    // Check if the issue already exists with the given title
    const {
      data: { body },
    } = await octokit.issues.get({
      owner: REPO_OWNER,
      repo: REPO,
      issue_number: process.env.ISSUE_NUMBER,
    });

    // console.log(body);

    if (!body) {
      console.log("No Issue found");
      return;
    }
    try {
      let title = process.env.TITLE;
      let description = process.env.DESCRIPTION || process.env.TITLE;
      if (!title && !description) {
        const response = await fetch(process.env.LINK);
        const html = await response.text();
        const $ = cheerio.load(html);

        title = $("head title").text();
        description =
          process.env.DESCRIPTION ||
          $('head meta[name="description"]').attr("content");
      }

      // For some reason We couldn't get the title or description.
      // (Article behind a paywall like Medium, ...)
      if (!description && !title) {
        return;
      }
      // Update issue with new link
      await octokit.issues.update({
        owner: REPO_OWNER,
        repo: REPO,
        issue_number: process.env.ISSUE_NUMBER,
        body:
          body +
          `
ㅤ
### [${title}](${process.env.LINK})
${description}`,
      });
      // NOTE: The invisible space is very important
      console.log("Issue updated, link added");
    } catch (error) {
      console.error("Error fetching the link:", error);
      return;
    }
  } catch (error) {
    console.error("Error creating the issue:", error);
  }
}

addLink();
