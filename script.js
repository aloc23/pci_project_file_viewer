const fileMap = {
  "draft contracts": [
    "Mayweather_DAFC_Lease_Agreement_2025.pdf",
    "Mayweather_DAFC_Heads_of_Terms_2025.pdf"
  ],
  "drawings": [
    "club overview.pdf",
    "HG_HALL_GABLES 2.pdf"
  ],
  "folios": [
    "philllips land folio.pdf",
    "DAFC folio_MH11730_041846.pdf"
  ],
  "quotes": [
    "Fw_ DOLAN PCI PADEL COURTS.eml",
    "004 Inxtremis 30 x 62 x 6m or 8m Sports Hall.pdf"
  ],
  "renders": [
    "x2.png", "aq.png", "Screenshot 2025-05-06 at 20.06.07.png", "x copy.png",
    "1af.png", "x3.png", "3af.png", "z9.png", "6f.png", "z8.png", "4fa.png", "x4.png",
    "z.png", "n8.png", "n.png", "bbb.png", "x.png", "a4.png", "aza.png", "az7.png",
    "1b.png", "az6.png", "dddd.png", "aaaa.png", "az5.png", "ccc.png", "az1.png",
    "ddd.png", "n10.png", "az3.png", "aaa.png", "2d.png", "d5.png", "x3 copy.png",
    "x2 copy.png", "d4.png", "cccc.png", "Screenshot 2025-05-06 at 20.05.04.png",
    "z10.png", "x12.png", "www.png", "b4.png", "n7.png", "z2.png", "z11.png", "w7.png",
    "Screenshot 2025-05-06 at 20.06.19.png", "w.png", "az.png", "w6.png", "ww.png",
    "w2.png", "z5.png", "z4.png", "w3.png", "z6.png", "c4.png", "a1b.png", "z7.png"
  ]
};

function loadFiles() {
  const folder = document.getElementById("folderSelect").value;
  const list = document.getElementById("fileList");
  const viewer = document.getElementById("fileViewer");
  list.innerHTML = "";
  viewer.src = "";
  viewer.hidden = true;

  const files = fileMap[folder];
  if (!files || files.length === 0) {
    list.innerHTML = "<li>No files found in this folder.</li>";
    return;
  }

  files.forEach(file => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = file;
    link.onclick = () => viewFile(folder + "/" + file);
    li.appendChild(link);
    list.appendChild(li);
  });
}

function viewFile(path) {
  const viewer = document.getElementById("fileViewer");
  viewer.src = "files/" + path;
  viewer.hidden = false;
}
export function initFilesTab() {
  const filesKey = 'uploadedFiles';
  const container = document.getElementById('filesTabContent');
  const form = document.getElementById('fileUploadForm');
  const input = document.getElementById('fileInput');

  function loadFiles() {
    const files = JSON.parse(localStorage.getItem(filesKey) || '[]');
    container.innerHTML = `
      <div class="file-list">
        ${files.map(file => `
          <div class="file-item">
            <span class="file-icon">📄</span>
            <span class="file-name">${file.name}</span>
            <span class="file-type">${file.type}</span>
            <span class="file-modified">${file.date}</span>
            <a href="${file.data}" download="${file.name}">Download</a>
            <button onclick="window.PCIPlanner.deleteFile('${file.name}')">Delete</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const files = Array.from(input.files);
    let stored = JSON.parse(localStorage.getItem(filesKey) || '[]');
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        stored.push({
          name: file.name,
          type: file.type,
          date: new Date().toISOString().slice(0,10),
          data: ev.target.result
        });
        localStorage.setItem(filesKey, JSON.stringify(stored));
        loadFiles();
      };
      reader.readAsDataURL(file);
    });
    input.value = ""; // Reset input after upload
  });

  window.PCIPlanner = window.PCIPlanner || {};
  window.PCIPlanner.deleteFile = function(filename) {
    let stored = JSON.parse(localStorage.getItem(filesKey) || '[]');
    stored = stored.filter(f => f.name !== filename);
    localStorage.setItem(filesKey, JSON.stringify(stored));
    loadFiles();
  };

  loadFiles();
}

