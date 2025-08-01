let dataList = [];
let currentIndex = null;

window.onload = function () {
  fetch("http://localhost:3000/data")
    .then(res => res.json())
    .then(data => {
      dataList = data;
      renderTable(dataList);
    });
};

function loadData() {
  fetch("http://localhost:3000/data")
    .then(res => res.json())
    .then(data => {
      dataList = data;
      renderTable(dataList);
    });
}

function simpanKeLocalStorage() {
  localStorage.setItem("dataList", JSON.stringify(dataList));
}

function renderTable(data, isSearch = false) {
  const tbody = document.getElementById("data-body");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const actualIndex = isSearch ? item.originalIndex : index;
    const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nama}</td>
          <td>Driver ${item.device}</td>
          <td>${item.serial}</td>
          <td>${item.note || ""}</td>
          <td>
            <button class="btn-tambah" onclick="editData(${actualIndex})">Edit</button>
            <button class="btn-hapus" onclick="hapusData(${actualIndex})">Hapus</button>
          </td>
        </tr>
      `;
    tbody.innerHTML += row;
  });
}

function updateNote(index, newNote) {
  dataList[index].note = newNote.trim();
  simpanKeLocalStorage();
}
function tambahData() {
  const nama = document.getElementById("nama").value.trim();
  const device = document.getElementById("device").value.trim();
  const serial = document.getElementById("serial").value.trim();

  if (!nama || !device) {
    alert("Nama dan device harus diisi!");
    return;
  }
  const isDuplicate = dataList.some(
    (item) =>
      item.nama.toLowerCase() === nama.toLowerCase() &&
    item.device.toLowerCase() === device.toLowerCase() &&
    item.serial.toLowerCase() === device.toLowerCase()
  );

  if (isDuplicate) {
    alert("Data yang sama sudah ada!");
    return;
  }
  fetch("http://localhost:3000/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, device, serial })
  })
    .then(res => res.json())
    .then(() => {
      loadData(); // ambil ulang dari DB
    });
  }

function hapusData(id) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    fetch(`http://localhost:3000/data/${id}`, { method: "DELETE" })
      .then(() => loadData());
  }
}

// function editData(index) {
//   const item = dataList[index];
//   const newNama = prompt("Edit Nama:", item.nama);
//   const newdevice = prompt("Edit Device:", item.device);  
//   const newSerial = prompt("Edit serial:", item.serial);

//   if (
//     newNama !== null &&
//     newdevice !== null &&
//     newSerial !== null &&
//     newNama.trim() !== "" &&
//     newdevice.trim() !== "" &&
//     newSerial.trim() !== ""
//   ) {
//     dataList[index] = {
//       nama: newNama.trim(),
//       device: newdevice.trim(),
//       serial: newSerial.trim(),
//     };
//     simpanKeLocalStorage();
//     renderTable(dataList);
//   }
// }

function editData(index) {
  currentIndex = index;
  const item = dataList[index];

  document.getElementById("editNama").value = item.nama;
  document.getElementById("editDevice").value = item.device;
  document.getElementById("editSerial").value = item.serial;
  document.getElementById("editNote").value = item.note;
  document.getElementById("editNote").value = item.note ? item.note : "";

  document.getElementById("editModal").style.display = "flex";
}

function saveEdit() {
  const newNama = document.getElementById("editNama").value.trim();
  const newDevice = document.getElementById("editDevice").value.trim();
  const newSerial = document.getElementById("editSerial").value.trim();
  const newNote = document.getElementById("editNote").value.trim();

  fetch(`http://localhost:3000/data/${dataList[currentIndex].id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama: newNama, device: newDevice, serial: newSerial, note: newNote })
  })
    .then(() => {
      loadData();
      closeModal();
    });
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}


function refreshData() {
  const savedData = localStorage.getItem("dataList");
  if (savedData) {
    dataList = JSON.parse(savedData);
  } else {
    dataList = [];
  }
  document.getElementById("cari").value = "";
  renderTable(dataList);
}

function cariData() {
  const keyword = document.getElementById("cari").value.toLowerCase().trim();
  const hasil = dataList
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(
      (item) =>
        item.device.toLowerCase().includes(keyword) ||
        item.nama.toLowerCase().includes(keyword) ||
        (item.note && item.note.toLowerCase().includes(keyword))
    );
  renderTable(hasil, true);
}

const express = require('express');
const app = express();  
const port = 3000;

app.get('/data', (req, res) => {
    res.json({ message: 'Data berhasil diambil' });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});