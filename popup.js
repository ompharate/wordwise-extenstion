document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const submitBtn = document.getElementById("submitBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");

  // Check if the API key exists in localStorage
  const savedApiKey = localStorage.getItem("apiKey");

  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
    apiKeyInput.disabled = true; // Disable input if API key is already saved
    submitBtn.textContent = "Edit"; // Change button text to 'Edit'
  }

  // Handle submit or edit button click
  submitBtn.addEventListener("click", function () {
    if (submitBtn.textContent === "Submit") {
      const apiKey = apiKeyInput.value.trim();

      if (apiKey) {
        // Save API key to localStorage
        localStorage.setItem("apiKey", apiKey);
        apiKeyInput.disabled = true; // Disable input
        submitBtn.textContent = "Edit"; // Change button text to 'Edit'
      } else {
        alert("Please enter a valid API key.");
      }
    } else if (submitBtn.textContent === "Edit") {
      // Enable input for editing
      apiKeyInput.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  // Handle dashboard button click (you can redirect or handle accordingly)
  dashboardBtn.addEventListener("click", function () {
    alert("Navigating to dashboard...");
    // Logic to navigate to the dashboard (e.g., window.location.href = 'dashboard.html')
  });
});
