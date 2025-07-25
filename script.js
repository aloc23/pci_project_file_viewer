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

function encodePath(path) {
  // Encode each folder and file separately to handle spaces and special chars
  return path.split('/').map(encodeURIComponent).join('/');
}

function loadFiles() {
  const folder = document.getElementById("folderSelect").value;
  const list = document.getElementById("fileList");
  list.innerHTML = "";

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
    link.onclick = (e) => {
      e.preventDefault();
      viewFile(folder, file);
    };
    li.appendChild(link);
    list.appendChild(li);
  });
}

function viewFile(folder, file) {
  const previewArea = document.getElementById("previewArea");
  previewArea.innerHTML = ""; // Clear previous

  const ext = file.split('.').pop().toLowerCase();
  const encodedPath = encodePath(folder + "/" + file);
  const url = "files/" + encodedPath;

  if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) {
    previewArea.innerHTML = `<img src="${url}" alt="${file}">`;
  } else if (["pdf"].includes(ext)) {
    previewArea.innerHTML = `<iframe src="${url}" style="width:100%;height:400px;" frameborder="0"></iframe>`;
  } else if (["txt", "csv", "json", "md"].includes(ext)) {
    fetch(url)
      .then(res => res.text())
      .then(text => {
        previewArea.innerHTML = `<pre>${text}</pre>`;
      })
      .catch(() => {
        previewArea.innerHTML = `<p>Unable to preview this file.</p>`;
      });
  } else {
    // For all other files, offer download
    previewArea.innerHTML = `<a href="${url}" download="${file}">Download ${file}</a>`;
  }
}

// ---- Upload/Delete/Preview (Local Storage) ----
function loadUploadedFiles() {
  const filesKey = 'uploadedFiles';
  const container = document.getElementById('uploadedFiles');
  const files = JSON.parse(localStorage.getItem(filesKey) || '[]');
  if (!files.length) {
    container.innerHTML = `<p>No files uploaded in this browser.</p>`;
    return;
  }
  container.innerHTML = files.map((file, i) => `
    <div class="uploaded-file">
      <span class="file-icon">📄</span>
      <span class="file-name">${file.name}</span>
      <span class="file-type">${file.type}</span>
      <span class="file-modified">${file.date}</span>
      <button onclick="previewUploadedFile(${i})" style="background:#2980b9;">Preview</button>
      <a href="${file.data}" download="${file.name}">Download</a>
      <button onclick="deleteUploadedFile(${i})">Delete</button>
    </div>
  `).join('');
}

function previewUploadedFile(idx) {
  const filesKey = 'uploadedFiles';
  const files = JSON.parse(localStorage.getItem(filesKey) || '[]');
  const file = files[idx];
  const previewArea = document.getElementById("previewArea");
  const ext = file.name.split('.').pop().toLowerCase();
  if (file.type.startsWith('image/')) {
    previewArea.innerHTML = `<img src="${file.data}" alt="${file.name}">`;
  } else if (file.type === 'application/pdf' || ext === 'pdf') {
    previewArea.innerHTML = `<iframe src="${file.data}" style="width:100%;height:400px;" frameborder="0"></iframe>`;
  } else if (file.type.startsWith('text/') || ["txt", "csv", "json", "md"].includes(ext)) {
    // Try to show text
    fetch(file.data)
      .then(res => res.text())
      .then(text => {
        previewArea.innerHTML = `<pre>${text}</pre>`;
      })
      .catch(() => {
        previewArea.innerHTML = `<p>Unable to preview this file.</p>`;
      });
  } else if (file.type.startsWith('audio/')) {
    previewArea.innerHTML = `<audio controls src="${file.data}" style="width:100%"></audio>`;
  } else if (file.type.startsWith('video/')) {
    previewArea.innerHTML = `<video controls src="${file.data}" style="width:100%;max-height:400px" controls></video>`;
  } else {
    previewArea.innerHTML = `<a href="${file.data}" download="${file.name}">Download ${file.name}</a>`;
  }
}

function deleteUploadedFile(idx) {
  const filesKey = 'uploadedFiles';
  let files = JSON.parse(localStorage.getItem(filesKey) || '[]');
  files.splice(idx, 1);
  localStorage.setItem(filesKey, JSON.stringify(files));
  loadUploadedFiles();
  document.getElementById("previewArea").innerHTML = "";
}

document.getElementById('fileUploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('fileInput');
  const files = Array.from(input.files);
  const filesKey = 'uploadedFiles';
  let stored = JSON.parse(localStorage.getItem(filesKey) || '[]');
  let filesProcessed = 0;
  if (!files.length) return;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      stored.push({
        name: file.name,
        type: file.type,
        date: new Date().toISOString().slice(0,10),
        data: ev.target.result
      });
      filesProcessed++;
      if (filesProcessed === files.length) {
        localStorage.setItem(filesKey, JSON.stringify(stored));
        loadUploadedFiles();
      }
    };
    reader.readAsDataURL(file);
  });
  input.value = "";
});

window.previewUploadedFile = previewUploadedFile;
window.deleteUploadedFile = deleteUploadedFile;

// ---- Init ----
window.onload = function() {
  document.getElementById("folderSelect").addEventListener("change", loadFiles);
  loadFiles();
  loadUploadedFiles();
};
