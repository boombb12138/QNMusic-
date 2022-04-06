// pages/home-video/index.js
import qnRequest from '../../service/index'

import {
    getTopMV
} from '../../service/api_video'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMVs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载(Created)
     */
    onLoad: function (options) {
        //方法1 没有封装请求方法
        // const _this = this
        // // 发送请求
        // wx.request({
        //     // 请求地址
        //     url: 'http://123.207.32.32:9001/top/mv',
        //     data: {
        //         offset: 0,
        //         //   请求10个数据
        //         limit: 10
        //     },
        //     //   请求成功的回调函数
        //     success(res) {
        //         console.log(res),
        //             _this.setData({ topMVs: res.data.data })
        //     },
        //     fail(err) {
        //         console.log(err)
        //     }

        // })

        // 方法2 封装请求方法
        qnRequest.get('/top/mv', {
            offset: 0,
            limit: 10
        }).then(
            res => {
                this.setData({
                    topMVs: res.data
                })
            }
        )
        // onLoad: function (options) {

        // // 方法3 分层封装
        // getTopMV(0).then(res => {
        //     this.setData({
        //         topMVs: res.data
        //     })
        // })
    },
    onPullDownRefresh: async function () {
        const res = await getTopMV(0)
        this.setData({
            topMVs: res.data
        })
    },
  
 
  
    // onReachBottom: async function () {
    //     console.log('到达底部')

    //     if (!this.data.hasMore) return
    //     const res = await getTopMV(this.data.topMVs.length)
    //     this.setData({
    //         topMVs: this.data.topMVs.concat(res.data)
    //     })
    //     this.setData({
    //         hasMore: res.hasMore
    //     })
    // },
    handleVideoItemClick: function (event) {
    const id = event.currentTarget.dataset.item.id
    //页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
    },
})