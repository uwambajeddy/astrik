const modalAddArea = document.querySelector('.modal_banner_add');
const addjobForm = document.querySelector('#contact_form_add');
const modalAdd = document.querySelector('.add_btn');
const modalUpdate = document.querySelectorAll('.update_btn');
const modalBlock = document.querySelector('.model_block');

if (modalAdd) {
    modalAddArea.style.top = '-500px';
    modalBlock.style.display = 'none';

    modalAdd.addEventListener('click', () => {
        if (modalAddArea.style.top == '-500px') {
            modalAddArea.style.top = '50%';
            modalBlock.style.display = 'block';
        } else {
            modalAddArea.style.top = '-500px';
            modalBlock.style.display = 'none';
        }

    });


    addjobForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        popupLoading('Creating job...');
        let dataValues = {};
        const formData = new FormData(addjobForm);
        for (var [key, value] of formData.entries()) {
            dataValues[key] = value;
        }
        try {
            await axios
                .post(`/api/v1/jobs/`, dataValues);
            popupLoadingRemove();
            popup(success, 'job created successfully');
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

}

function updateModal(id) {
    const modalUpdateArea = document.querySelector(`.modal_banner_update_${id}`);
    const formSubmit = document.querySelector(`#form_${id}`);
    modalBlock.addEventListener("click", () => {
        modalUpdateArea.classList.remove('upwards');
        modalBlock.style.display = 'none';
    })

    if ([...modalUpdateArea.classList].includes("upward")) {
        modalUpdateArea.classList.remove('upwards');
        modalBlock.style.display = 'none';
        modalBlock.style.display = 'none';
    } else {
        modalUpdateArea.classList.add('upwards');
        modalBlock.style.display = 'block';
    };


    formSubmit.addEventListener("submit", async (e) => {
        e.preventDefault();
        popupLoading('Updating job...');
        let dataValues = {};
        const formData = new FormData(formSubmit);
        for (var [key, value] of formData.entries()) {
            dataValues[key] = value;
        }
        try {
            await axios
                .patch(`/api/v1/jobs/${id}`, dataValues);
            popupLoadingRemove();
            popup(success, 'job updated successfully');
            setTimeout(() => {
                location.reload();
            }, 3000);

        } catch (error) {
            popupLoadingRemove();
            if (error.response.data?.message) {
                popup(failure, `${error.response.data.message}`);
            } else {
                popup(failure, `${error.message}`);
            }
        }

    });


}

async function deletejob(id) {

    popupLoading('Deleting job...');

    try {
        await axios
            .delete(`/api/v1/jobs/${id}`);
        location.reload()

    } catch (error) {
        popupLoadingRemove();
        if (error.response.data?.message) {
            popup(failure, `${error.response.data.message}`);
        } else {
            popup(failure, `${error.message}`);
        }
    }


}

modalBlock.addEventListener('click', () => {
    modalAddArea.style.top = '-500px';
    modalBlock.style.display = 'none';
});
