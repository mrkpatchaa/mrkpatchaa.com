require("dotenv").config();
const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const REPO = "mrkpatchaa.com";
const REPO_OWNER = "mrkpatchaa";

// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

// Authenticate using a personal access token
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

// Define the issue title, tag, and content
const issueTitle = `Digest - Week ${new Date().getFullYear()}/${new Date().getWeek()}`;
const tag = "blog:published";
const content = `/*----
slug: digest-week-${new Date().getFullYear()}${new Date().getWeek()}
excerpt: Weekly digest of my readings and interesting topics. Week ${new Date().getWeek()} of ${new Date().getFullYear()}.
tags:
----*/`;

async function createIssue() {
  try {
    // Check if the issue already exists with the given title
    const { data: issues } = await octokit.issues.listForRepo({
      owner: REPO_OWNER,
      repo: REPO,
      state: "open",
      creator: REPO_OWNER,
      per_page: 100,
      milestone: 1,
    });

    const existingIssue = issues.find((issue) => issue.title === issueTitle);

    if (existingIssue) {
      console.log("Issue already exists:", existingIssue.html_url);
      try {
        fs.appendFileSync("./.env", `\nISSUE_NUMBER=${existingIssue.number}`);
        console.log("Content appended to the file successfully.");
      } catch (err) {
        console.error("An error occurred while appending to the file:", err);
      }
      return;
    }

    // Create a new issue with the specified title, tag, and content
    const { data: newIssue } = await octokit.issues.create({
      owner: REPO_OWNER,
      repo: REPO,
      title: issueTitle,
      body: content,
      labels: [tag],
      milestone: 1,
    });

    console.log("New issue created:", newIssue.html_url);
  } catch (error) {
    console.error("Error creating the issue:", error);
  }
}

createIssue();
