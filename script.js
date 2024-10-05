// Function to load entries from localStorage and display them in "our entries.html"
function loadEntries() {
    const entriesContainer = document.getElementById('entries-container');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    entriesContainer.innerHTML = '';

    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-box';

        // Populate the div with the entry content and add Edit and Delete buttons
        entryDiv.innerHTML = `
            <h3>${entry.title}</h3>
            <p>${entry.content}</p>
            <button onclick="openEditForm(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delete</button>
        `;
        entriesContainer.appendChild(entryDiv);
    });
}

// Function to save a new entry in "add new entry.html"
function saveEntry(event) {
    event.preventDefault();
    const title = document.getElementById('entry-title').value;
    const content = document.getElementById('entry-content').value;
    
    const newEntry = { title, content };
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(newEntry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Redirect to the entries page after saving
    window.location.href = 'our entries.html';
}

// Attach saveEntry function to the form submit event in "add new entry.html"
if (document.getElementById('entry-form')) {
    document.getElementById('entry-form').addEventListener('submit', saveEntry);
}

// Load entries when "our entries.html" is loaded
if (document.getElementById('entries-container')) {
    window.addEventListener('load', loadEntries);
}

// Functionality for the Mood Tracker calendar section in "mood Track.html"
document.addEventListener('DOMContentLoaded', () => {
    const monthYearElement = document.getElementById('current-month-year');
    const datesElement = document.getElementById('calendar');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    
    let currentDate = new Date();

    const updateCalendar = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
    
        const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthYearElement.textContent = monthYearString;
    
        let datesHTML = '';
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || {};
        console.log('Mood entries:', moodEntries); // Log the mood entries before rendering

        // Empty slots for days before the first day of the month
        for (let i = 0; i < firstDayIndex; i++) {
            datesHTML += `<div class="day empty"></div>`;
        }
    
        // Create day slots for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const formattedDate = `${currentYear}-${currentMonth + 1}-${day}`;
            const mood = moodEntries[formattedDate] ? 
                `<span class="mood" onclick="removeMood('${formattedDate}', event)">${moodEntries[formattedDate]}</span>` : '';
            datesHTML += `<div class="day" onclick="showEmojiPicker('${formattedDate}')">${day}${mood}</div>`;
        }
    
        datesElement.innerHTML = datesHTML;
    }

    // Call updateCalendar on page load
    updateCalendar();

    // Add event listeners for the previous and next month buttons
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
});

// Function to remove mood for a specific date
function removeMood(date, event) {
    event.stopPropagation(); // Prevent the parent div's click event from firing
    
    console.log(`Removing mood for date: ${date}`); // Log the date whose mood is being removed

    const moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || {};
    
    // Delete the mood entry for the specified date
    delete moodEntries[date];
    
    // Save the updated moods back to localStorage
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    
    // Update the calendar to reflect changes
    updateCalendar();
}

// Function to show the emoji picker for a selected date in "mood Track.html"
function showEmojiPicker(selectedDate) {
    console.log(`Showing emoji picker for date: ${selectedDate}`); // Log the selected date
    const emojiPicker = document.getElementById('emoji-picker');
    emojiPicker.classList.remove('hidden');

    window.selectedDate = selectedDate; // Store selected date

    const emojiOptions = document.getElementById('emoji-options');
    emojiOptions.onclick = (event) => {
        if (event.target.tagName === 'SPAN') {
            saveMood(window.selectedDate, event.target.textContent);
            emojiPicker.classList.add('hidden');
        }
    };
}

// Function to save the selected mood to localStorage in "mood Track.html"
function saveMood(date, mood) {
    console.log(`Saving mood for ${date}: ${mood}`); // Log the date and mood being saved
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || {};
    moodEntries[date] = mood;
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    updateCalendar(); // Refresh the calendar to show the updated mood
}

// Function to open the edit form for a specific entry
let currentEntryIndex = null; // Store the index of the entry being edited

function openEditForm(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];

    // Populate the edit form with the current entry details
    document.getElementById('edit-entry-title').value = entry.title;
    document.getElementById('edit-entry-content').value = entry.content;

    // Show the modal
    document.getElementById('edit-entry-modal').style.display = 'block';
    currentEntryIndex = index; // Set the current entry index
}

// Function to close the edit form
function closeEditForm() {
    document.getElementById('edit-entry-modal').style.display = 'none';
}

// Event listener for the edit entry form submission
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('edit-entry-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const updatedTitle = document.getElementById('edit-entry-title').value;
    const updatedContent = document.getElementById('edit-entry-content').value;

    // Get existing entries from localStorage
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    // Update the entry
    entries[currentEntryIndex] = { title: updatedTitle, content: updatedContent };
    
    // Save the updated entries back to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Reload the entries to reflect the changes
    loadEntries();
    
    // Close the edit form
    closeEditForm();
});
});

// Function to delete an entry
function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    // Remove the entry at the specified index
    entries.splice(index, 1);
    
    // Save the updated entries back to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Reload the entries to reflect the changes
    loadEntries();
}

