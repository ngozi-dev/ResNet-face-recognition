import request from "./request"


export const put = async (url: string, data: any) => {
    return new Promise((resolve, reject) => {
        request(url, 'PUT', data)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch((error: any) => reject(error))
    })
}

export default put;