import request from "./request";


const del = async (url: string) => {
    return new Promise((resolve, reject) => {
        request(url, 'DELETE')
        .then(res => res.json())
        .then(data => resolve(data))
        .catch((err: any) => reject(err))
    }); 
}


export default del;