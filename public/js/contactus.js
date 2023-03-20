/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const contactform = document.querySelector('.contact_form');
const sendMessage = document.querySelector('#send-message');

sendMessage.addEventListener('click', async (e) => {
  e.preventDefault();
  popupLoading('Sending message...');
  const email = document.querySelector('#email').value;
  const name = document.querySelector('#name').value;
  const message = document.querySelector('#message').value;

  if (
    name.trim() == '' ||
    email.trim() == '' ||
    message.trim() == ''
  ) {
    popupLoadingRemove();
    popup(warning, 'Please fill empty fields!!');
    return 0;
  }

  try {
    await axios.post(`/api/v1/messages/`, {
      email,
      name,
      message,
    });
    document.querySelector('#email').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#message').value = '';
    popupLoadingRemove();
    popup(success, 'Thanks for your feedback 🤓');
    disibleControl.style.display = 'none';
  } catch (error) {
    console.log(error);
    popupLoadingRemove();
    if (error.response.data?.message) {
      popup(failure, `${error.response.data.message}`);
    } else {
      popup(failure, `${error.message}`);
    }
  }
});
