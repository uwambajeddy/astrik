
async function deleteComment(id) {

    popupLoading('Deleting comment...');

    try {
        await axios
            .delete(`/api/v1/blogs/comment/delete/${id}`);
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

async function approveComment(id) {

    popupLoading('Approving comment...');

    try {
        await axios
            .get(`/api/v1/blogs/comment/approve/${id}`);
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
