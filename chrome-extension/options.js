document
  .getElementById("optionsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const ownerInput = document.getElementById("owner");
    const repoInput = document.getElementById("repo");
    const githubTokenInput = document.getElementById("githubToken");
    const workflowFileInput = document.getElementById("workflowFile");

    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();
    const githubToken = githubTokenInput.value.trim();
    const workflowFile = workflowFileInput.value.trim();

    if (owner && repo && githubToken && workflowFile) {
      const extensionData = {
        owner: owner,
        repo: repo,
        workflowFile: workflowFile,
        githubToken: githubToken,
      };

      chrome.storage.sync.set(extensionData, function () {
        ownerInput.value = "";
        repoInput.value = "";
        githubTokenInput.value = "";
        workflowFileInput.value = "";

        alert("Extension data saved successfully!");
      });
    } else {
      alert("Please fill in all fields.");
    }
  });
