import request from "./request"

const get = async (url: string) => {
    return new Promise((resolve, reject) => {
        request(url, 'GET')
        .then(res => res.json())
        .then(data => resolve(data))
        .catch((error: any) => reject(error))
    })
}

export default get;