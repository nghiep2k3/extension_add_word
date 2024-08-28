// Tạo thẻ div mới
const divElement = document.createElement("div");
var active = false;

// Thêm class cho thẻ div
divElement.className = "nghiep1320";

// Thêm thẻ div vào body
document.body.appendChild(divElement);

// Tạo nút mới
const button = document.createElement("button");
button.textContent = "Add word";
button.style.marginTop = "10px";
button.style.padding = "5px";
button.className = "add_word";

// Thêm nút vào thẻ div
divElement.appendChild(button);

// Biến để lưu trữ từ đã bôi đen
let selectedText = "";

// Hàm để xử lý sự kiện kéo thả
function makeElementDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener("mousedown", function (event) {
    isDragging = true;
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", function (event) {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    document.body.style.userSelect = "";
  });
}

makeElementDraggable(divElement);

// Hàm để lưu từ được bôi đen vào biến
document.addEventListener("mouseup", function () {
  let text = window.getSelection().toString().trim();
  if (text) {
    selectedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
});

// Hàm để lấy ID hiện tại từ local storage
function getCurrentId() {
  const currentId = localStorage.getItem("currentId");
  return currentId ? parseInt(currentId, 10) : 1;
}

// Hàm để lưu ID mới vào local storage
function setCurrentId(newId) {
  localStorage.setItem("currentId", newId);
}
function generateUUID() {
  // Hàm để tạo UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function postData(data, uuid, lesson) {
  fetch(
    `https://web---vocabulary-default-rtdb.firebaseio.com/${lesson}/Vocabulary/${uuid}.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => console.log("Data saved successfully:", data))
    .catch((error) => console.error("Error saving data:", error));
}

// Hàm để tạo form khi ấn nút "Add word"
button.addEventListener("click", function () {
  if (active) {
    alert("đang chọn");
    return;
  }
  active = true;
  if (selectedText) {
    // Tạo form container
    const formContainer = document.createElement("div");
    formContainer.className = "formContainer";

    //Tạo input cho bài học
    const lesson = document.createElement("input");
    lesson.type = "text";
    let savedValue = localStorage.getItem("currentInputValue") || "Luyện Tập";
    lesson.value = savedValue;
    lesson.placeholder = "Bài học";
    lesson.style.marginRight = "10px";

    // Tạo input cho từ đã chọn
    const wordInput = document.createElement("input");
    wordInput.type = "text";
    wordInput.value = selectedText; // Đặt từ đã bôi đen vào input
    wordInput.placeholder = "Từ tiếng anh";
    wordInput.style.marginRight = "10px";

    // Tạo input cho nghĩa của từ
    const meaningInput = document.createElement("input");
    meaningInput.type = "text";
    meaningInput.placeholder = "Nghĩa của từ";
    meaningInput.style.marginRight = "10px";

    // Tạo nút "Thêm từ"

    const addButton = document.createElement("button");
    addButton.className = "addButton";

    addButton.textContent = "+";
    addButton.style.marginRight = "10px";

    const cancel = document.createElement("button");
    cancel.className = "cancelButton";
    cancel.textContent = "x";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "add_close";
    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(cancel);

    // Thêm các thành phần vào form container
    formContainer.appendChild(lesson);
    formContainer.appendChild(wordInput);
    formContainer.appendChild(meaningInput);
    formContainer.appendChild(buttonContainer);

    // Thêm form container vào thẻ div
    divElement.appendChild(formContainer);

    // Xóa form sau khi thêm từ (tùy chọn)
    addButton.addEventListener("click", function () {
      const uuid = generateUUID();
      let currentId = getCurrentId();
      const data = {
        id: currentId,
        answer: wordInput.value,
        question: meaningInput.value,
        ref: uuid,
      };
      postData(data, uuid, lesson.value);
      setCurrentId(currentId + 1);
      console.log("Word:", wordInput.value);
      console.log("Meaning:", meaningInput.value);
      let newValue = lesson.value;
      localStorage.setItem('currentInputValue', newValue);
      selectedText = " ";
      wordInput.value = " ";
      meaningInput.value = " ";
      active = false;
      divElement.removeChild(formContainer);
    });
    cancel.addEventListener("click", function () {
      selectedText = " ";
      wordInput.value = " ";
      meaningInput.value = " ";
      active = false;
      divElement.removeChild(formContainer);
    });
  } else {
    active = false;
    return;
  }
});
