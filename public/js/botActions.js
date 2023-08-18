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
