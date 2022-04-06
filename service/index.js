const BASE_URL = "http://123.207.32.32:9001"
const LOGINBASE_URL = "http://123.207.32.32:3000"

class QNRequest {
    constructor(baseURL) {
        this.baseURL = baseURL
    }
    request(url, method, params,header={}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url:this.baseURL + url,
                method: method,
                data: params,
                header:header,
                success: function (res) {
                    resolve(res.data)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    }

    get(url, params,header) {
        return this.request(url, 'GET', params,header)
    }
    post(url, data,header) {
        return this.request(url, 'POST', data,header)
    }
}


const qnRequest = new QNRequest(BASE_URL)

const qnRequestLogin = new QNRequest(LOGINBASE_URL)
export default qnRequest
export {qnRequestLogin}