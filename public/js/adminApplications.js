async function deleteMessage(id) {

    popupLoading('Deleting Application...');

    try {
        await axios
            .delete(`/api/v1/jobs/apply/${id}`);
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