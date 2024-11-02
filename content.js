const icon = document.createElement("div");
icon.innerText = "wordwise";
icon.style.position = "absolute";
icon.style.padding = "5px 10px";
icon.style.backgroundColor = "#3BC14A";
icon.style.border = "1px solid #4D5057";
icon.style.color = "#FFFFFF";
icon.style.cursor = "pointer";
icon.style.zIndex = "1000";
icon.style.display = "none";
icon.style.fontSize = "14px";
icon.style.borderRadius = "5px";
icon.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
document.body.appendChild(icon);

let selectedText = "";
let mouseX;
let mouseY;

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection().toString().trim();
  mouseX = event.pageX;
  mouseY = event.pageY;
  if (selection.length > 0) {
    selectedText = selection;
    icon.style.top = `${mouseY + 5}px`;
    icon.style.left = `${mouseX + 5}px`;
    icon.style.display = "block";
  } else {
    icon.style.display = "none";
  }
});

icon.addEventListener("click", async () => {
  icon.style.display = "none";
  const word = selectedText;

  const card = document.createElement("div");
  const cardHeader = document.createElement("div");
  cardHeader.style.display = "flex";
  cardHeader.style.justifyContent = "space-between";
  cardHeader.style.alignItems = "center";
  cardHeader.style.justifyItems = "center";
  card.style.position = "absolute";
  card.style.backgroundColor = "#FFFFFF";
  card.style.border = "1px solid #4D5057";
  card.style.color = "#4D5057";
  card.style.padding = "10px";
  card.style.top = `${mouseY + 10}px`;
  card.style.left = `${mouseX}px`;
  card.style.zIndex = "1000";
  card.style.borderRadius = "5px";
  card.style.width = "500px";
  card.style.maxHeight = "400px";
  card.style.overflowY = "auto";
  card.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.1)";

  const h1 = document.createElement("h1");
  h1.innerText = word;
  h1.style.fontSize = "18px";
  h1.style.marginBottom = "10px";

  const loadingMessage = document.createElement("p");
  loadingMessage.innerText = "Fetching details...";
  loadingMessage.style.color = "#4D5057";
  card.appendChild(loadingMessage);

  const button = document.createElement("button");
  button.innerText = "Close";
  button.style.display = "block";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#3BC14A";
  button.style.color = "#FFFFFF";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.style.display = "block";
  saveButton.style.padding = "5px 10px";
  saveButton.style.backgroundColor = "#3BC14A";
  saveButton.style.color = "#FFFFFF";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";

  const buttonGroup = document.createElement("div");
  buttonGroup.style.display = "flex";
  buttonGroup.style.gap = "5px";
  buttonGroup.appendChild(button);
  buttonGroup.appendChild(saveButton);

  cardHeader.appendChild(h1);
  cardHeader.appendChild(buttonGroup);

  card.appendChild(cardHeader);
  const hr = document.createElement("hr");
  card.appendChild(hr);

  button.onclick = () => {
    card.remove();
  };

  saveButton.onclick = () => {
    saveToBackend(word);
  };

  document.body.appendChild(card);

  try {
    const response = await askGemini(word);

    loadingMessage.remove();

    const htmlContent = marked.parse(response || "");
    console.log("html content", htmlContent);

    const markdownContainer = document.createElement("div");
    markdownContainer.innerHTML = htmlContent;
    markdownContainer.style.color = "#4D5057";

    card.appendChild(markdownContainer);
  } catch (error) {
    loadingMessage.innerText = "Error fetching details.";
    console.error("Error in fetching:", error);
  }
});

async function askGemini(word) {
  const response = await fetch(`http://localhost:4000/api/gemini/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}

async function saveToBackend(selectedText) {
  try {
    const savedApiKey = await getApiKey(); // Wait for the API key retrieval
    if (!savedApiKey) {
      alert("API key not found!");
      return;
    }

    alert("Key is: " + savedApiKey);

    const response = await fetch(`http://localhost:4000/api/user/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: selectedText, extensionKey: savedApiKey }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Data saved successfully!");
    } else {
      alert("Failed to save data to the backend.");
    }
  } catch (error) {
    console.error("Error fetching the API key or saving to backend:", error);
  }
}

async function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["apiKey"], function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (result.apiKey) {
        resolve(result.apiKey);
      } else {
        resolve(null);
      }
    });
  });
}
