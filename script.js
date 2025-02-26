document.addEventListener("DOMContentLoaded", function () {
    let sheetData = [];
    let found;
    let rollno;

    // Load data from Google Sheet
    function loadData() {
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
    document.getElementById("attendance-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        rollno = document.getElementById("rollno").value.trim();
        found = sheetData[rollno]; // Find student

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

                if (key === "Roll Number") {
                    row = `<tr>
                        <td><strong>${key.replace(/_/g, " ")}</strong></td>
                        <td colspan=2>${value}</td>
                    </tr>`;
                } else {
                    row = `<tr>
                        <td><strong>${key.replace(/_/g, " ")}</strong></td>
                        <td>${value}</td>	
                        <td>${firstRowData[key]}</td>
                    </tr>`;
                }
                tableBody.innerHTML += row;
            });
            document.getElementById("main").classList.toggle("hidden");
            // Get attendance percentage and enable/disable button
            let percentage = parseFloat(found["Percentage"]);
            const button = document.getElementById("generateAdmitCard");
            if (percentage >= 75) {
                button.disabled = false; // Enable button
                button.addEventListener("click", function () {
                    generateAmitCard();
                });
            } else {
                button.disabled = true; // Disable button
                button.classList.add('hidden');
            }
        } else {
            outputDiv.classList.add("hidden");
            alert("Roll number not found!");
        }
    });

    function generateAmitCard() {
        alert("Admit Card Generated Successfully!");
    }

    let hamburger = document.getElementById("hamburger");
    hamburger.addEventListener("click", ()=>{
       document.getElementById("main").classList.toggle("hidden"); 
    });
});

