const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/post');
      } else {
        alert('Failed to delete post');
      }
    }
  };
  
  document
    .querySelector('#postTitle')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('#postContent')
    .addEventListener('click', delButtonHandler);
  