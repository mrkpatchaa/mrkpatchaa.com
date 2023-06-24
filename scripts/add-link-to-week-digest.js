require("dotenv").config();
const { Octokit } = require("@octokit/rest");

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

    console.log(body);

    if (!body) {
      console.log("No Issue found");
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
### [${process.env.TITLE}](${process.env.LINK})
${process.env.DESCRIPTION}`,
    });
    // NOTE: The invisible space is very important
    console.log("Issue updated, link added");
  } catch (error) {
    console.error("Error creating the issue:", error);
  }
}

addLink();
