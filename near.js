document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const northSideButton = document.getElementById("northSideButton");
    const southSideButton = document.getElementById("southSideButton");
    const downtownButton = document.getElementById("downtownButton");
    const serviceTableBody = document.getElementById("serviceTableBody");
    const selectedServiceCentersList = document.getElementById("selectedServiceCentersList");
    const copyToClipboardButton = document.getElementById("copyToClipboardButton");

    // Function to update the button styling
    function setActiveButton(button) {
        // Reset styling for all buttons
        northSideButton.classList.remove("active");
        southSideButton.classList.remove("active");
        downtownButton.classList.remove("active");

        // Set the active class for the clicked button
        button.classList.add("active");
    }

    // Function to display service centers in the table
    function displayServiceCenters(serviceCenters) {
        serviceTableBody.innerHTML = ""; // Clear previous data
        serviceCenters.forEach(serviceCenter => {
            // Create table rows and cells for each service center
            const row = document.createElement("tr");
            const serviceCenterCell = document.createElement("td");
            serviceCenterCell.textContent = serviceCenter;
            const selectionCell = document.createElement("td");
            const selectionInput = document.createElement("input");
            selectionInput.type = "checkbox";
            selectionCell.appendChild(selectionInput);
            row.appendChild(serviceCenterCell);
            row.appendChild(selectionCell);
            serviceTableBody.appendChild(row);
        });
    }

    // Function to fetch and display service centers data
    function fetchData(location) {
        fetch('near.json')
            .then(response => response.json())
            .then(data => {
                const locationData = data[0][location];
                if (locationData && locationData.SERVICE_CENTERS) {
                    const serviceCenters = locationData.SERVICE_CENTERS;
                    displayServiceCenters(serviceCenters);
                }
            })
            .catch(error => console.error('Error fetching data:', error));

        setActiveButton(event.currentTarget); // Use event.currentTarget to access the clicked button
    }

    // Event listeners for location buttons
    northSideButton.addEventListener("click", (event) => {
        fetchData("NORTH-SIDE");
    });

    southSideButton.addEventListener("click", (event) => {
        fetchData("SOUTH-SIDE");
    });

    downtownButton.addEventListener("click", (event) => {
        fetchData("DOWNTOWN");
    });

    // Load list.json data
    let listData;
    fetch('list.json')
        .then(response => response.json())
        .then(data => {
            listData = data;
        })
        .catch(error => console.error('Error fetching list data:', error));

    // Function to display details of selected service centers
    function displaySelectedServiceCenterDetails(selectedIndexes) {
        selectedServiceCentersList.innerHTML = ""; // Clear previous details
        selectedIndexes.forEach(selectedIndex => {
            const selectedServiceCenterData = listData[selectedIndex];
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <p><strong>Company Name:</strong> ${selectedServiceCenterData["Company Name"]}</p>
                <p><strong>Contact Number:</strong> ${selectedServiceCenterData["Contact Numbers"]}</p>
                <p><strong>Email:</strong> ${selectedServiceCenterData["E-Mail Address "]}</p>
            `;
            selectedServiceCentersList.appendChild(listItem);
        });
    }

    // Array to keep track of selected service center indexes
    const selectedIndexes = [];

    // Event listener for checkbox changes
    serviceTableBody.addEventListener("change", (event) => {
        const selectedRow = event.target.closest("tr");
        if (selectedRow) {
            const selectedCheckbox = event.target;
            const selectedIndex = selectedRow.rowIndex - 1; // Adjust for header row

            if (selectedCheckbox.checked) {
                // Add the index to the selectedIndexes array
                selectedIndexes.push(selectedIndex);
            } else {
                // Remove the index from the selectedIndexes array
                const indexToRemove = selectedIndexes.indexOf(selectedIndex);
                if (indexToRemove !== -1) {
                    selectedIndexes.splice(indexToRemove, 1);
                }
            }

            // Update the displayed details
            displaySelectedServiceCenterDetails(selectedIndexes);
        }
    });

    // Event listener for button click to copy selected service centers to clipboard
    copyToClipboardButton.addEventListener("click", () => {
        const textToCopy = selectedServiceCentersList.innerText;

        // Create a temporary textarea to hold the text
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);

        // Select the text in the textarea and copy it to the clipboard
        tempTextArea.select();
        document.execCommand("copy");

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);

        // Provide user feedback
        alert("Selected service centers copied to clipboard!");
    });

    // Trigger the NORTH-SIDE button click event on page load
    northSideButton.click(); // This will load NORTH-SIDE service centers initially
});
