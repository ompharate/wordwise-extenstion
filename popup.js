document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const submitBtn = document.getElementById("submitBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const errorMessage = document.getElementById("error-message");

  chrome.storage.sync.get("apiKey", function (data) {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
      apiKeyInput.disabled = true;
      submitBtn.textContent = "Edit";
    }
  });

  submitBtn.addEventListener("click", function () {
    errorMessage.style.display = "none";

    if (submitBtn.textContent === "Submit") {
      const apiKey = apiKeyInput.value.trim();

      if (apiKey) {
        chrome.storage.sync.set({ apiKey: apiKey }, function () {
          if (chrome.runtime.lastError) {
            console.error("Error saving API key:", chrome.runtime.lastError);
            errorMessage.textContent = "Failed to save API key.";
            errorMessage.style.display = "block";
          } else {
            apiKeyInput.disabled = true;
            submitBtn.textContent = "Edit";
          }
        });
      } else {
        errorMessage.textContent = "Please enter a valid API key.";
        errorMessage.style.display = "block";
      }
    } else if (submitBtn.textContent === "Edit") {
      apiKeyInput.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  dashboardBtn.addEventListener("click", function () {
    const dashboardUrl = "https://wordwise.ompharate.tech/dashboard";
    chrome.tabs.create({ url: dashboardUrl }, function (tab) {
    });
  });
});
