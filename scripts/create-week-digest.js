const { Octokit } = require("@octokit/rest");

const REPO = "mrkpatchaa.com";
const REPO_OWNER = "mrkpatchaa";
const GH_TOKEN = process.env.GH_TOKEN;

/**
 * https://stackoverflow.com/questions/9045868/javascript-date-getweek
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof dowOffset == "number" ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

// Authenticate using a personal access token
const octokit = new Octokit({ auth: GH_TOKEN });

// Define the issue title, tag, and content
const issueTitle = `Digest - Week ${new Date().getFullYear()}/${new Date().getWeek()}`;
const tag = "blog:published";
const content = `/----
slug: digest-week-${new Date().getFullYear()}${new Date().getWeek()}
excerpt: Weekly digest of my readings and interesting topics. Week ${new Date().getWeek()} of ${new Date().getFullYear()}.
tags:
----/`;

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
