const programForm = document.querySelector('.program-form');
const submitButton = document.querySelector('#submit-button');
const modules = document.querySelector('#module');
const continueButton = document.querySelector('#continue-button');
const validateLayer = document.querySelector('.validation-layer');


submitButton.addEventListener("click", async (e) => {
 e.preventDefault();
 popupLoading('Registering...');
 const formData = new FormData(programForm);
 let dataValues = {};
 for (var [key, value] of formData.entries()) {
  dataValues[key] = value;
 }

 if (dataValues.program == "Fidic Training Program") {
  dataValues.module = [...modules.selectedOptions].map(e => e.label);
 } else {
  dataValues.module = []
 }


 try {
  await axios
   .post(`/api/v1/training/`, dataValues);
  popupLoadingRemove();
  popup(success, 'Registered successfully');
  setTimeout(() => {
   location.reload();
  }, 3000);

 } catch (error) {
  console.log(error)
  popupLoadingRemove();
  if (error.response.data?.message) {
   popup(failure, `${error.response.data.message}`);
  } else {
   popup(failure, `${error.message}`);
  }
 }

});

validateLayer.addEventListener("click", () => {

 const formData = new FormData(programForm);
 let dataValues = {};

 for (var [key, value] of formData.entries()) {
  dataValues[key] = value;
 }

 if (dataValues.program == "Fidic Training Program") {
  dataValues.module = [...modules.selectedOptions].map(e => e.label);
 } else {
  delete dataValues.module;
 }
 console.log(dataValues)
 for (var [key, value] of Object.entries(dataValues)) {

  if (value.length == 0) {
   popup(warning, 'Please, fill all empty fields.'); return;
  }

 }
 continueButton.click()
});