const programForm = document.querySelector('.program-form');
const programPrice = document.querySelector('#program-price');
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
 for (var [key, value] of Object.entries(dataValues)) {

  if (value.length == 0) {
   popup(warning, 'Please, fill all empty fields.'); return;
  }

 }
 switch (dataValues.program) {

  case "Fidic Training Program":

   programPrice.innerHTML = `$${800 * dataValues.module.length}`
   break;
  case "Project Management Professional":
   programPrice.innerHTML = "$800"
   break;
  case "International Road Federation":
   programPrice.innerHTML = "$800"
   break;
  case "Asphalt Technology":
   programPrice.innerHTML = "$800"
   break;
  case "Hdm-4 version 2 training courses":
   programPrice.innerHTML = "$800"
   break;
  default:
   programPrice.innerHTML = "damn"
   break;
 }

 continueButton.click()
});