const icon = document.createElement("div");
icon.innerText = "Show";
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
  button.style.marginTop = "10px";
  button.style.display = "block";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#3BC14A"; 
  button.style.color = "#FFFFFF";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  cardHeader.appendChild(h1);
  cardHeader.appendChild(button);
  card.appendChild(cardHeader);
  // card.appendChild(button);

  button.onclick = () => {
    card.remove();
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
  const response = await fetch(`http://localhost:4000/gemini/generate`, {
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