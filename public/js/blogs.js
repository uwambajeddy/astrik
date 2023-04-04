let modalAddArea = document.querySelector('.modal_banner_add');
const addBlogForm = document.querySelector('#contact_form_add');
const modalAdd = document.querySelector('.add_btn');
const modalUpdate = document.querySelectorAll('.update_btn');
const modalBlock = document.querySelector('.model_block');

if (modalAdd) {

    modalAdd.addEventListener('click', () => {
        modalAddArea.style.top == "" ? modalAddArea.style.top = "-500px" : "";
        if (modalAddArea.style.top == '-500px') {
            modalAddArea.style.top = '50%';
            modalBlock.style.display = 'block';
        } else {
            modalAddArea.style.top = '-500px';
            modalBlock.style.display = 'none';
        }

    });

    addBlogForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        popupLoading('Creating blog...');
        const formData = new FormData(addBlogForm);
        try {
            await axios
                .post(`/api/v1/blogs/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            popupLoadingRemove();
            popup(success, 'Blog created successfully');
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
        popupLoading('Updating blog...');
        let dataValues = {};
        const formData = new FormData(formSubmit);
        for (var [key, value] of formData.entries()) {
            dataValues[key] = value;
          }
        try {
           await axios
                .patch(`/api/v1/blogs/${id}`, dataValues);
            popupLoadingRemove();
            popup(success, 'Blog updated successfully');
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

async function deleteBlog(id) {

    popupLoading('Deleting blog...');

    try {
        await axios
            .delete(`/api/v1/blogs/${id}`);
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
    if (modalAddArea) modalAddArea.style.top = '-500px';
    modalBlock.style.display = 'none';
});
