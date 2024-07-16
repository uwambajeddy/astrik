/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const commentform = document.querySelector('.comment-form');

commentform.addEventListener('submit', async (e) => {
  e.preventDefault();
  popupLoading('Sending your application...');

  let dataValues = {};
  const formData = new FormData(commentform);
  // for (var [key, value] of formData.entries()) {
  //   dataValues[key] = value;
  // }
  // console.log(formData)
  try {
    await axios.post(`/api/v1/jobs/apply`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    popupLoadingRemove();

    popup(success, "Your application was sent successfully");
    setTimeout(() => {
      location.reload();
    }, 3000);
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
