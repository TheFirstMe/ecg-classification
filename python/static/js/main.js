const createTable = (data) => {
  const labels = ["zero", "one", "two", "three"];
  const newLabels = {
    zero: "N",
    one: "S",
    two: "V",
    three: "F",
  };

  const table = document.createElement("table");
  table.setAttribute("class", "table table-bordered");
  const header = document.createElement("tr");
  const labelCell = document.createElement("th");
  const percCell = document.createElement("th");
  labelCell.innerHTML = "Class";
  percCell.innerHTML = "Percentage";
  labelCell.setAttribute("scope", "col");
  percCell.setAttribute("scope", "col");
  header.appendChild(labelCell);
  header.appendChild(percCell);
  table.appendChild(header);

  labels.forEach((label, id) => {
    const row = table.insertRow(id + 1);
    const labelCell = row.insertCell(0);
    const percCell = row.insertCell(1);

    labelCell.innerHTML = newLabels[label];
    percCell.innerHTML = Math.round(data.result[label] * 100) / 100 + "%";
  });

  return table;
};

const loader = document.querySelector("#loader");
loader.style.display = "none";

const result = document.querySelector("#result");
result.style.display = "none";

const uploadButton = document.querySelector("#imageUpload");
const predictButton = document.querySelector("#btn-predict");
const predictButtonText = document.querySelector('#btn-predict-text')

uploadButton.addEventListener("change", () => {
  predictButton.disabled = false;
  result.innerHTML = "";
  result.style.display = "none";
});

predictButton.addEventListener("click", () => {
  const form = document.querySelector("#upload-file");
  const formData = new FormData(form);

  predictButton.disabled = true;
  loader.style.display = "inline-block";
  predictButtonText.innerHTML = 'Predicting...'

  fetch("/predict", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      res
        .json()
        .then((data) => {
          loader.style.display = "none";
          result.style.display = "block";
          predictButtonText.innerHTML = 'Upload'
          uploadButton.value = "";

          if (!data.success) {
            result.innerHTML = data.message;
            return console.log(data);
          }

          const table = createTable(data);
          const heading = document.createElement("h4");
          heading.innerHTML = "Results:";
          heading.className = "mb-4";
          result.appendChild(heading);
          result.appendChild(table);
          console.log("Success!");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});
