import React from 'react';
import axios from 'axios';

export function uploadDocument() {
    const [imageData, setImage] = React.useState();
    function upload() {
        if (imageData) {
            const formData = new FormData();
            formData.append('image', imageData!)
            let jsonRpc = {
                command: "uploadDocument",
                data: {
                    accountId: '',

                }
            }
            axios.post('http://localhost:8080', imageData)
                .then(response => console.log(response.data))
                .catch(error => console.log(error))
        }
    }
    return (
        <React.Fragment>
            <input type="file" name="imageUpload" onChange={(event: any) => setImage(event.target.files[0])} />
            <button onClick={() => upload()} disabled={!!imageData ? true : false}>uploadDocument</button>
        </React.Fragment>
    );
}