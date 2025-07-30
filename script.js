async function loadGallery() {
  const gallery = document.getElementById("gallery");
  const response = await fetch("data.json");
  const screenshots = await response.json();

  screenshots.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden";

    card.innerHTML = `
      <a href="${item.amazon}" target="_blank">
        <img src="${item.image}" alt="${item.caption}" class="w-full h-60 object-cover">
      </a>
      <div class="p-4">
        <h2 class="text-lg font-semibold">${item.caption}</h2>
        <p class="text-gray-600 text-sm mt-1">${item.description}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

loadGallery();
