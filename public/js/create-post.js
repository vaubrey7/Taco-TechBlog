const newFormHandler = async (event) => {
    event.preventDefault();
  
    const postTitle = document.querySelector('#postTitle').value;
    const postContent = document.querySelector('#postContent').value.trim();

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify(
            {
                postTitle,
                postContent
            }
        ),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(resopnse.statusText);
    }
}

document.querySelector('.newPost').addEventListener('submit', newForm);