document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const submitBtn = document.getElementById("submitBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const errorMessage = document.getElementById("error-message");

  const savedApiKey = localStorage.getItem("apiKey");

  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
    apiKeyInput.disabled = true;
    submitBtn.textContent = "Edit";
  }

  submitBtn.addEventListener("click", function () {
    errorMessage.style.display = "none"; 

    if (submitBtn.textContent === "Submit") {
      const apiKey = apiKeyInput.value.trim();

      if (apiKey) {
    
        chrome.storage.sync.set({ apiKey: apiKey }, function () {
          console.log("API key saved:", apiKey);
        });
        
        apiKeyInput.disabled = true; 
        submitBtn.textContent = "Edit"; 
      } else {
        errorMessage.style.display = "block"; 
      }
    } else if (submitBtn.textContent === "Edit") {
      apiKeyInput.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  dashboardBtn.addEventListener("click", function () {
  
    alert("Navigating to dashboard...");
  });
});
