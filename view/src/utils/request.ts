const request = (url: string, method: string, data?: any) => {
    return fetch(
        url,
        {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data)
        }
    )
}

export default request;