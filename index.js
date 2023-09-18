// Function to fetch JSON data from the file
async function fetchJSONData() {
    try {
        const response = await fetch('list.json'); // Replace with your JSON file path
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

// Function to handle checkbox click event
function handleCheckboxClick(event) {
    const checkbox = event.target;
    const row = checkbox.closest('tr'); // Find the parent <tr> element

    if (checkbox.checked) {
        row.classList.add('highlighted'); // Add the 'highlighted' class to the row
    } else {
        row.classList.remove('highlighted'); // Remove the 'highlighted' class from the row
    }
}

// Function to populate the table with JSON data based on search terms
async function populateTable(companySearchTerm = '', citySearchTerm = '') {
    const jsonData = await fetchJSONData();
    const tableBody = document.getElementById('data-table-body');

    if (jsonData) {
        tableBody.innerHTML = ''; // Clear the table body

        jsonData.forEach(entry => {
            // Check if the company name and/or city matches the search terms
            const companyNameMatches = entry["Company Name"].toLowerCase().includes(companySearchTerm.toLowerCase());
            const cityMatches = entry["City"].toLowerCase().includes(citySearchTerm.toLowerCase());

            if (companyNameMatches && cityMatches) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><b>${entry["Company Name"]}</b></td>
                    <td>${entry["Category"]}</td>
                    <td>${entry["City"]}</td>
                    <td>${entry["Address"]}</td>
                    <td>${entry["Contact Numbers"]}</td>
                    <td>${entry["E-Mail Address "]}</td>
                `;
                 // Create a checkbox for highlighting the row
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.addEventListener('click', handleCheckboxClick); // Add click event listener
                checkbox.className = 'highlight-checkbox';

                // Create a cell for the checkbox
                const checkboxCell = document.createElement('td');
                checkboxCell.appendChild(checkbox);
                
                // Append the checkbox cell to the row
                row.appendChild(checkboxCell);

                tableBody.appendChild(row);
            }

            
        });
    }
}

// Handle input field changes to trigger the search by Company Name
const searchByNameInput = document.getElementById('searchByName');
searchByNameInput.addEventListener('input', function () {
    const companySearchTerm = this.value;
    const citySearchTerm = getCitySearchTerm(); // Get the current value in the City search input field
    populateTable(companySearchTerm, citySearchTerm);
});

// Handle input field changes to trigger the search by City
const searchByCityInput = document.getElementById('searchByCity');
searchByCityInput.addEventListener('input', function () {
    const companySearchTerm = getCompanySearchTerm(); // Get the current value in the Company Name search input field
    const citySearchTerm = this.value;
    populateTable(companySearchTerm, citySearchTerm);
});

// Function to get the current value in the Company Name search input field
function getCompanySearchTerm() {
    return searchByNameInput.value;
}

// Function to get the current value in the City search input field
function getCitySearchTerm() {
    return searchByCityInput.value;
}

let isShowingAll = false;

// Function to handle the "Show All Rows" button click event
function showAllRows() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = ''; // Show all rows
    });

    // Change button text and behavior back to "Show Highlighted Rows"
    const filterButton = document.getElementById('filter-button');
    filterButton.textContent = 'Show Highlighted Rows';
    filterButton.removeEventListener('click', showAllRows);
    filterButton.addEventListener('click', showHighlightedRows);

    isShowingAll = false;
}

// Function to handle the "Show Highlighted Rows" button click event
function showHighlightedRows() {
    const highlightedRows = document.querySelectorAll('tbody tr.highlighted');
    const allRows = document.querySelectorAll('tbody tr');
    const filterButton = document.getElementById('filter-button');

    if (highlightedRows.length > 0) {
        allRows.forEach(row => {
            if (!row.classList.contains('highlighted')) {
                row.style.display = 'none'; // Hide non-highlighted rows
            } else {
                row.style.display = ''; // Show highlighted rows
            }
        });

        // Change button text and behavior to "Show All Rows"
        filterButton.textContent = 'Show All Rows';
        filterButton.removeEventListener('click', showHighlightedRows);
        filterButton.addEventListener('click', showAllRows);

        isShowingAll = true;
    }
}

// Add an event listener to the "Show Highlighted Rows" button
const filterButton = document.getElementById('filter-button');
filterButton.addEventListener('click', () => {
    if (isShowingAll) {
        showHighlightedRows();
    } else {
        showAllRows();
    }
});


/// Function to handle the "Remove Highlighted Rows" button click event
function removeHighlightedRows() {
    const checkboxes = document.querySelectorAll('td input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false; // Uncheck the checkbox
            const row = checkbox.closest('tr');
            row.classList.remove('highlighted'); // Remove the 'highlighted' class from the row
        }
    });
}

// Add an event listener to the button
const removeHighlightButton = document.getElementById('remove-highlight-button');
removeHighlightButton.addEventListener('click', removeHighlightedRows);

// Call the function to populate the table when the page loads
populateTable(); // Populate the table on the first load
