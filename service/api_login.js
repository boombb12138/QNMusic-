import {
    qnRequestLogin
} from './index'

export function getLoginCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 1000,
            success: (res) => {
                resolve(res.code)
            },
            fail: (err) => {
                reject(err)
            }

        })
    })

}

export function CodeToToken(code) {
    return qnRequestLogin.post("/login", {
        code
    })
}

export function checkToken(token) {
    return qnRequestLogin.post("/auth", {}, {
        token
    })
}

export function checkSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success: () => {
                resolve(true)
            },
            failed: () => {
                reject(false)
            }
        })
    })
}

export function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            desc: '你好啊李银河',
            success: (res) => {
                resolve(res)
            },
            failed: (err) => {
                reject(err)
            }
        })
    })
}