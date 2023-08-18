document.addEventListener("DOMContentLoaded", function() {
    // Grab all the delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteBot(this.getAttribute('data-bot-id'));
        });
    });
});

function deleteBot(botId) {
    // Use the fetch API to send a DELETE request to our server
    fetch(`/bot/${botId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // If successful, remove the bot's row from the table
            const btn = document.querySelector(`[data-bot-id="${botId}"]`);
            btn.closest('tr').remove();
            location.reload(true);
        } else {
            // If there was an error, display it
            alert(data.message || 'Error deleting bot.');
        }
    })
    .catch(error => {
        alert('Network error or server-side issue. Please try again.');
    });
}

function editBotName(botId) {
    const nameSpan = document.querySelector(`.bot-name[data-bot-id="${botId}"]`);
    const nameInput = document.querySelector(`.bot-name-edit[data-bot-id="${botId}"]`);
    
    // Toggle display
    nameSpan.style.display = 'none';
    nameInput.style.display = 'block';
    
    // Focus on the input to let the user start typing immediately
    nameInput.focus();

    // Attach an event to detect when the user presses "Enter"
    nameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // You can send an AJAX request to update the bot name in the database
            // For simplicity, I'm just updating the displayed name and toggling the display back
            nameSpan.textContent = nameInput.value;
            nameSpan.style.display = 'block';
            nameInput.style.display = 'none';

            // TODO: Save the updated name to the database
            fetch(`/bot/${botId}`, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // If successful, remove the bot's row from the table
                    const btn = document.querySelector(`[data-bot-id="${botId}"]`);
                    btn.closest('tr').remove();
                    location.reload(true);
                } else {
                    // If there was an error, display it
                    alert(data.message || 'Error deleting bot.');
                }
            })
            .catch(error => {
                alert('Network error or server-side issue. Please try again.');
            });
            
        }
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success) {
        document.getElementById('successAlert').style.display = 'block';
    }

    if (error) {
        document.getElementById('errorAlert').style.display = 'block';
    }
};