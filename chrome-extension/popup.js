document
  .getElementById("triggerButton")
  .addEventListener("click", async function () {
    const activeTab = await getActiveTab();

    const loadingIndicator = document.getElementById("loadingIndicator");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    loadingIndicator.classList.remove("hidden");
    successMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");

    try {
      const { owner, repo, token, workflowFile } = await getExtensionData();
      const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;

      const data = {
        ref: "main", // Replace with the branch name where your workflow is defined
        inputs: {
          link: activeTab.url,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessageText =
          errorResponse.message || "Failed to trigger the workflow.";
        throw new Error(errorMessageText);
      }

      successMessage.classList.remove("hidden");
    } catch (error) {
      errorMessage.textContent = `Error triggering the workflow: ${error.message}`;
      errorMessage.classList.remove("hidden");
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  });

async function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0];
        resolve(activeTab);
      } else {
        reject(new Error("Unable to retrieve active tab."));
      }
    });
  });
}

async function getExtensionData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ["owner", "repo", "githubToken", "workflowFile"],
      function (result) {
        const { owner, repo, githubToken, workflowFile } = result;
        if (owner && repo && githubToken && workflowFile) {
          resolve({
            owner,
            repo,
            workflowFile,
            token: githubToken,
          });
        } else {
          reject(new Error("Extension data not found in storage."));
        }
      }
    );
  });
}
