let sheetData = [];

// Load data from Google Sheet
function loadData(){
fetch("https://attendance-bice-eta.vercel.app/api/fetchSheet")
    .then(response => response.text())
    .then(csvText => {
        sheetData = $.csv.toObjects(csvText);
	firstRowData = sheetData[0];
    })
    .catch(error => console.error("Error loading CSV:", error));
}
loadData();

document.getElementById("refresh").addEventListener("click", loadData);
// Handle form submission
document.getElementById("attendance-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    let rollno = document.getElementById("rollno").value.trim();
    let found = sheetData[rollno];

    let outputDiv = document.getElementById("output");
    let tableBody = document.getElementById("data-table");
    tableBody.innerHTML = "";

    if (found) {
        outputDiv.classList.remove("hidden");

	let entries = Object.entries(found).slice(2);
        entries.forEach(([key, value]) => {
	let row;
            if (key === "Percentage") {
                value += "%"; // Append % sign
            }
		if (key === "Roll Number"){
				row = `<tr>
		<td><strong>${key.replace(/_/g, " ")}</strong></td>
		<td colspan=2>${value}</td>
            </tr>`;
			}else{
            row = `<tr>
                <td><strong>${key.replace(/_/g, " ")}</strong></td>
		<td>${value}</td>	
		<td>${firstRowData[key]}</td>
            </tr>`;}
            tableBody.innerHTML += row;
        });
    } else {
        outputDiv.classList.add("hidden");
        alert("Roll number not found!");
    }
});
