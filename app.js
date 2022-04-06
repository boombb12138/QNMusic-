// app.js
import {
    getLoginCode,
    CodeToToken,
    checkToken,
    checkSession
} from './service/api_login'

import {
    TOKEN_KEY
} from './constants/token-const'
App({
    // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch: async function () {
        //1  獲取设备信息
        const info = wx.getSystemInfoSync()
        this.globalData.statusBarHeight = info.statusBarHeight
        this.globalData.screenHeight = info.screenHeight
        const systemRadio = info.screenHeight / info.screenWidth
        this.globalData.systemRadio = systemRadio

        this.handleLogin()

        wx.getUserProfile({
          desc: '你好啊李银河',
        })
    },

    handleLogin: async function () {
        //2  让用户默认登录
        const token = wx.getStorageSync(TOKEN_KEY)
        // 判断token是否过期/无效/错误
        const checkResult = await checkToken(token)
        // 判断Session是否过期
        const isSessionExpire = await checkSession()

        if (!token || checkResult.code || !isSessionExpire) {
            this.loginAction()
        }
    },

    loginAction: async function () {
        // 1 获取code
        const code = await getLoginCode()

        // 2 将code 发送给自己的服务器
        const result = await CodeToToken(code)
        const token = result.token
        // 3 获取服务器返回的token 将token保存到storage里面
        wx.setStorageSync(TOKEN_KEY, token)
    },
    loginout(){
        wx.showModal({
          title: '提示',
          content: '您确定要退出登录吗',
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
              wx.setStorageSync('token', '');//将token置空
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      },

    globalData: {
        statusBarHeight: 0,
        navBarHeight: 44,
        screenHeight: 0,
        systemRadio: 0

    }
})