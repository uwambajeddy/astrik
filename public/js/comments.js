/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const commentform = document.querySelector('.comment-form');

commentform.addEventListener('submit', async (e) => {
  e.preventDefault();
  popupLoading('Sending your comment...');

  let dataValues = {};
  const formData = new FormData(commentform);
  for (var [key, value] of formData.entries()) {
      dataValues[key] = value;
    }
  try {
    await axios.post(`/api/v1/blogs/comment/_`, 
      dataValues
    );
    popupLoadingRemove();

    popup(success, "Thanks for your comment");
  } catch (error) {
    popupLoadingRemove();
    console.log(error);
    if (error.response?.data?.message) {
      popup(failure, `${error.response.data.message}`);
    } else {
      popup(failure, `${error.message}`);
    }
  }
});
