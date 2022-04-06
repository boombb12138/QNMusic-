// import { rankingStore } from "../../store"

import {
    playerStore,
    rankingStore
} from "../../store/index"

import {
    getSongMenuDetail
} from '../../service/api_music'

// pages/detail-songs/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ranking: {},
        songInfo: {},
        id: ''
    },

    onLoad: function (options) {
        if (options.type === "menu") {
            const id = options.id
            this.setData({
                id
            })
            getSongMenuDetail(id).then(res => {
                // console.log(res.playlist)
                this.setData({
                    songInfo: res.playlist
                })
            })

        } else if (options.type === "ranking") {
            const ranking = options.ranking
            this.setData({
                ranking
            })
            // 1 获取数据
            rankingStore.onState(ranking, this.getRankingDataHandler)
        }

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },


    getRankingDataHandler: function (res) {
        this.setData({
            songInfo: res
        })
    },
    handleItemClick: function (event) {
        const index = event.currentTarget.dataset.index
        console.log(index)
        playerStore.setState("playSongList", this.data.songInfo.tracks)
        playerStore.setState("playSongListIndex", index)
    }


})