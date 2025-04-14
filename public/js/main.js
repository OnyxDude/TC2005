const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

fetch('/your-action', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken 
    },
    body: JSON.stringify({
        _csrf: csrfToken
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
