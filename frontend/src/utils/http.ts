export class $http {
    static request(method: string, url: string, data: any, config: any) {
        // lisasime frontendi tsconfig.json faili lib alla "es2015.promise"
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();


            // @ts-ignore
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            xhr.open(method, `${BASE_URL}${url}`);
            xhr.setRequestHeader('Content-Type', 'application/json')

            // add Authorization header
            const sessionId = localStorage.getItem('sessionId') || '';
            if (sessionId) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + sessionId);
                console.log(sessionId)
            }


            xhr.onload = () => {
                let parsedResponse: any

                try {
                    parsedResponse = JSON.parse(xhr.response);
                } catch (e) {
                    parsedResponse = {message: xhr.response};
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        body: parsedResponse
                    });
                    return;
                }

                // Check if config contains error property
                if (config && !config.disableErrorHandling) {
                    // Check if parsedResponse contains error property
                    if (parsedResponse.error) {
                        alert(parsedResponse.error);
                    } else {
                        alert(xhr.response)
                    }
                }

                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    body: parsedResponse

                });

                return;

            };
            xhr.onerror = () => {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            // send the request with or without data, depending on whether it's null
            xhr.send(data !== null ? JSON.stringify(data) : undefined);
        });

    }

    static post(url: string, data: any, config = {}) {
        return this.request('POST', url, data, config);
    }

    static get(url: string, data: any, config = {}) {
        return this.request('GET', url, data, config);
    }

    static delete(url: string) {
        return this.request('DELETE', url, null, null);
    }

    static put(url: string, data: { id: string, image: string; name: string; description: string }) {
        console.log('url: ', url);
        return this.request('PUT', url, data, null);
    }
}