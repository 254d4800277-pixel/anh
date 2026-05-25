// Khởi tạo mảng lưu trữ danh sách kỹ năng từ localStorage hoặc mảng rỗng
let skillList = JSON.parse(localStorage.getItem("skills")) || [];

// Khi trang web tải xong, kiểm tra nếu đang ở trang quản lý thì render dữ liệu cũ
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("skillTableBody");
  if (tableBody) {
    renderTable(skillList);
    checkExcellentSkills(skillList);
  }

  // Đồng bộ hiển thị con số tức thì khi kéo thanh trượt mức độ (Range Input)
  const skillRange = document.getElementById("skillLevel");
  const levelValueLabel = document.getElementById("levelValue");
  if (skillRange && levelValueLabel) {
    skillRange.addEventListener("input", function () {
      levelValueLabel.innerText = this.value;
    });
  }

  // Xử lý sự kiện submit form (Thêm kỹ năng)
  const skillForm = document.getElementById("skillForm");
  if (skillForm) {
    skillForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Chặn hành vi reload trang

      const mssvValue = document.getElementById("mssv").value.trim();
      const techName = document.getElementById("techName").value.trim();
      const releaseYear = document.getElementById("releaseYear").value.trim();
      const skillLevel = parseInt(document.getElementById("skillLevel").value);
      const note =
        document.getElementById("note").value.trim() || "Không ghi chú";

      const newCourse = { techName, releaseYear, skillLevel, note };

      // Thực hiện thêm khóa học theo logic số cuối MSSV
      addCourse(newCourse, skillList, mssvValue);

      // Lưu trữ mảng vào localStorage để chia sẻ dữ liệu liên tục
      localStorage.setItem("skills", JSON.stringify(skillList));

      // Kiểm tra tính năng bổ sung và reset form
      checkExcellentSkills(skillList);
      skillForm.reset();
      if (levelValueLabel) levelValueLabel.innerText = "5";
    });
  }
});

/**
 * Logic định danh: Số cuối MSSV Lẻ chèn Đầu, Chẵn chèn Cuối
 */
function addCourse(newCourse, list, mssvValue) {
  const lastDigit = parseInt(mssvValue.slice(-1));

  if (isNaN(lastDigit)) {
    alert("Cảnh báo: Mã số sinh viên nhập vào không hợp lệ!");
    return;
  }

  if (lastDigit % 2 !== 0) {
    list.unshift(newCourse); // Số cuối lẻ -> Chèn ĐẦU bảng
  } else {
    list.push(newCourse); // Số cuối chẵn -> Chèn CUỐI bảng
  }

  renderTable(list);
}

/**
 * Hàm xuất dữ liệu từ mảng ra bảng HTML
 */
function renderTable(list) {
  const tableBody = document.getElementById("skillTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  list.forEach((item) => {
    const row = document.createElement("tr");
    let badgeColor =
      item.skillLevel >= 7
        ? "bg-success"
        : item.skillLevel >= 5
          ? "bg-warning text-dark"
          : "bg-danger";

    row.innerHTML = `
      <td class="fw-bold text-dark">${item.techName}</td>
      <td><span class="badge bg-secondary p-2">${item.releaseYear}</span></td>
      <td><span class="badge ${badgeColor} px-3 py-2 fs-6">${item.skillLevel} / 10</span></td>
      <td class="text-muted text-start">${item.note}</td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Tính năng mở rộng: Tự động đếm số lượng kỹ năng > 7 điểm.
 */
function checkExcellentSkills(list) {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) return;

  const excellentCount = list.filter((item) => item.skillLevel > 7).length;

  if (excellentCount > 15) {
    alertContainer.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show shadow-sm border-0" role="alert">
        🎉 <strong>Hồ sơ năng lực rất ấn tượng!</strong> Bạn đang sở hữu tới ${excellentCount} kỹ năng đạt mức độ xuất sắc (&gt;7).
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  } else {
    alertContainer.innerHTML = "";
  }
}

/**
 * Hàm xóa toàn bộ dữ liệu trong bảng và bộ nhớ
 */
function clearAllData() {
  if (confirm("Bạn có chắc muốn xóa sạch toàn bộ danh sách kỹ năng không?")) {
    localStorage.removeItem("skills");
    skillList = [];
    renderTable(skillList);
    checkExcellentSkills(skillList);
  }
}
