// ===== CONFIGURATION =====
const GITHUB_USERNAME = "your-username"; 
const REPO = "book-screenshot-gallery"; 
const BRANCH = "main"; 
const TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // Store securely!

async function uploadScreenshot() {
  const fileInput = document.getElementById("imageFile");
  const caption = document.getElementById("caption").value;
  const description = document.getElementById("description").value;
  const amazon = document.getElementById("amazon").value;
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    alert("Please select an image first.");
    return;
  }

  const file = fileInput.files[0];
  const base64Image = await toBase64(file);
  const imagePath = `images/${file.name}`;

  status.textContent = "Uploading image to GitHub...";

  // Step 1: Upload image
  await commitFile(imagePath, base64Image, `Add image ${file.name}`);

  // Step 2: Update data.json
  const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO}/${BRANCH}/data.json`);
  let data = await response.json();

  data.push({ image: imagePath, caption, description, amazon });

  const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  await commitFile("data.json", updatedContent, `Update gallery with ${file.name}`);

  status.textContent = "✅ Screenshot added successfully! Check the gallery.";
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

async function commitFile(path, content, message) {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${path}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content, branch: BRANCH }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${errorText}`);
  }
}
