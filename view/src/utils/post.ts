import request from "./request";

const post = async (url: string, data: any) => {
    return new Promise((resolve, reject) => {
        request(url, 'POST', data)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch((error: any) => reject(error))
    }) 
}


export default post;