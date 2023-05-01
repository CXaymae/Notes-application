// Selecting elements from the DOM
const addBox = document.querySelector(".add-box"); // Selecting the add-box element
const popupBox = document.querySelector(".popup-box"); // Selecting the popup-box element
const popupTitle = popupBox.querySelector("header p"); // Selecting the paragraph element inside the header of the popup box
const closeIcon = popupBox.querySelector("header i"); // Selecting the i element inside the header of the popup box
const titleTag = popupBox.querySelector("input"); // Selecting the input element inside the popup box for title
const descTag = popupBox.querySelector("textarea"); // Selecting the textarea element inside the popup box for description
const addBtn = popupBox.querySelector("button"); // Selecting the button element inside the popup box

// Declaring constants
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // An array of month names
const notes = JSON.parse(localStorage.getItem("notes") || "[]"); // An array of notes retrieved from local storage, if no notes are found then an empty array is returned
let isUpdate = false; // A flag variable to indicate if the user is updating an existing note or creating a new one, initialized to false
let updateId; // A variable to store the id of the note being updated, initialized to undefined

// Event listener for the "Add new Note" button
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note"; // Set the popup title
    addBtn.innerText = "Add Note"; // Change the button text to "Add Note"
    popupBox.classList.add("show"); // Show the popup
    document.querySelector("body").style.overflow = "hidden"; // Disable scrolling on the page
    if (window.innerWidth > 660) titleTag.focus(); // Set focus to the title input field if the screen width is greater than 660px
  });
  
  // Event listener for the close icon
  closeIcon.addEventListener("click", () => {
    isUpdate = false; // Reset the update flag
    titleTag.value = descTag.value = ""; // Clear the input fields
    popupBox.classList.remove("show"); // Hide the popup
    document.querySelector("body").style.overflow = "auto"; // Enable scrolling on the page
  });

// A function to display the notes
function showNotes() {
    // Check if there are notes stored
// Remove any existing notes from the list
document.querySelectorAll(".note").forEach(li => li.remove());

// Loop through the notes array and create HTML tags to display each note
notes.forEach((note, id) => {
    // Replace newline characters in the description with <br/> tags
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    
    // Create HTML tags for the note
    let liTag = `<li class="note">
                    <div class="details">
                        <p>${note.title}</p>
                        <span>${filterDesc}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </div>
                </li>`;
    
    // Insert the HTML tags after the "Add new note" button
    addBox.insertAdjacentHTML("afterend", liTag);
});
}
// Call the function to display the notes when the page loads
showNotes();

// This function displays the context menu when the user clicks on the ellipsis icon of a note
function showMenu(elem) {
    // Add the "show" class to the parent element of the icon, which displays the menu
    elem.parentElement.classList.add("show");
    // Add a click event listener to the document, which hides the menu when the user clicks anywhere outside the menu
    document.addEventListener("click", e => {
        // If the user clicks on an element that is not an ellipsis icon or is not the same icon that opened the menu, remove the "show" class from the parent element
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// This function deletes a note from the notes array and updates the local storage and the UI
function deleteNote(noteId) {
    // Ask the user to confirm if they want to delete the note
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    // Remove the note from the notes array and update the local storage
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    // Update the UI to reflect the changes
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    // Replace any occurrences of '<br/>' in the description with '\r\n'
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    // Set the 'updateId' variable to the provided 'noteId'
    updateId = noteId;
    // Set the 'isUpdate' flag to true
    isUpdate = true;
    // Click the 'addBox' element (presumably to display the note update form)
    addBox.click();
    // Set the 'value' property of the 'titleTag' element to the provided 'title'
    titleTag.value = title;
    // Set the 'value' property of the 'descTag' element to the updated description
    descTag.value = description;
    // Set the text content of the 'popupTitle' element to 'Update a Note'
    popupTitle.innerText = "Update a Note";
    // Set the text content of the 'addBtn' element to 'Update Note'
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Get the values of the 'titleTag' and 'descTag' elements, trimming any leading/trailing whitespace
    let title = titleTag.value.trim(),
        description = descTag.value.trim();
    // Check if either the title or description has a value
    if(title || description) {
        // Get the current date and format it as a string
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();
        // Create an object containing the note title, description, and date
        let noteInfo = {title, description, date: `${month} ${day}, ${year}`};
        // If 'isUpdate' is false, add the note to the 'notes' array
        if(!isUpdate) {
            notes.push(noteInfo);
        } else { // Otherwise, update the note at the specified index in the 'notes' array
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        // Store the 'notes' array in local storage as a JSON string
        localStorage.setItem("notes", JSON.stringify(notes));
        // Call the 'showNotes' function to update the UI with the new/updated note(s)
        showNotes();
        // Click the 'closeIcon' element to hide the note form
        closeIcon.click();
    }
});
