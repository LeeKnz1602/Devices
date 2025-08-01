let dataList = [];
let currentIndex = null;

window.onload = function () {
  const savedData = localStorage.getItem("dataList");
  if (savedData) {
    dataList = JSON.parse(savedData);
  }
  renderTable(dataList);
};

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
  simpanKeLocalStorage();
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
  dataList.push({ nama, device, serial });
  document.getElementById("nama").value = "";
  document.getElementById("device").value = "";
  document.getElementById("serial").value = "";
  simpanKeLocalStorage();
  renderTable(dataList);
}

function hapusData(index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    dataList.splice(index, 1);
    simpanKeLocalStorage();
    renderTable(dataList);
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

  if (!newNama || !newDevice || !newSerial) {
    alert("Semua field harus diisi!");
    return;
  }

  dataList[currentIndex] = {
    nama: newNama,
    device: newDevice,
    serial: newSerial,
    note: newNote,
  };

  simpanKeLocalStorage();
  renderTable(dataList);
  closeModal();
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
