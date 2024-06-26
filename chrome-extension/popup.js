document.addEventListener('DOMContentLoaded', async function () {
  const activeTab = await getActiveTab()
  if (!activeTab.url || !activeTab.url.startsWith('http')) {
    // throw new Error("Url not supported");
    alert('Url not supported')
    return
  }
  const { title, description } = await getTabMetadata(activeTab.id)
  document.getElementById('titleContent').value = title
  document.getElementById('descriptionContent').value = description
  document.getElementById('defaultContainer').classList.remove('hidden')
  document.getElementById('defaultLoading').classList.add('hidden')
})

document.getElementById('repoLink').addEventListener('click', async function () {
  const errorMessage = document.getElementById('errorMessage')
  errorMessage.classList.add('hidden')
  try {
    const { owner, repo } = await getExtensionData()
    chrome.tabs.create({ url: `https://github.com/${owner}/${repo}/issues` })
  } catch (error) {
    errorMessage.textContent = `Error triggering the workflow: ${error.message}`
    errorMessage.classList.remove('hidden')
  } finally {
    loadingIndicator.classList.add('hidden')
  }
})

document.getElementById('triggerButton').addEventListener('click', async function () {
  const loadingIndicator = document.getElementById('loadingIndicator')
  const successMessage = document.getElementById('successMessage')
  const errorMessage = document.getElementById('errorMessage')
  const title = document.getElementById('titleContent').value?.trim()
  const description = document.getElementById('descriptionContent').value?.trim()

  loadingIndicator.classList.remove('hidden')
  successMessage.classList.add('hidden')
  errorMessage.classList.add('hidden')

  try {
    const { owner, repo, token, workflowFile } = await getExtensionData()
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`

    const activeTab = await getActiveTab()

    const data = {
      ref: 'main', // Replace with the branch name where your workflow is defined
      inputs: {
        link: activeTab.url,
        title: title,
        description: description,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      const errorMessageText = errorResponse.message || 'Failed to trigger the workflow.'
      throw new Error(errorMessageText)
    }

    successMessage.classList.remove('hidden')
  } catch (error) {
    errorMessage.textContent = `Error triggering the workflow: ${error.message}`
    errorMessage.classList.remove('hidden')
  } finally {
    loadingIndicator.classList.add('hidden')
  }
})

async function getTabMetadata(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: () => {
          const title = document.querySelector('title').innerText.trim()
          const description =
            document.querySelector('meta[name="description"]')?.content?.trim() ||
            document.querySelector('meta[property="og:description"]')?.content?.trim() ||
            ''
          return {
            title: title,
            description: description,
          }
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(results[0].result)
        }
      }
    )
  })
}

async function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0]
        resolve(activeTab)
      } else {
        reject(new Error('Unable to retrieve active tab.'))
      }
    })
  })
}

async function getExtensionData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['owner', 'repo', 'githubToken', 'workflowFile'], function (result) {
      const { owner, repo, githubToken, workflowFile } = result
      if (owner && repo && githubToken && workflowFile) {
        resolve({
          owner,
          repo,
          workflowFile,
          token: githubToken,
        })
      } else {
        reject(new Error('Extension data not found in storage.'))
      }
    })
  })
}
