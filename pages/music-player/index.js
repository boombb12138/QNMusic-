// pages/music-player/index.js
// import {HYEventStore} from 'hy-event-store'

import {
    audioContext,
    playerStore
} from '../../store/index'
const playModeNames = ["order", "repeat", "random"]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,

        currentSong: {},
        lyricInfo: [],
        durationTime: 0,

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: '',

        currentPage: 0,
        isShowLyric: true,
        contentHeight: 0,
        sliderValue: 0,
        isSliderChanging: false,
        songStop: false,
        lyricScrollTop: 0,

        isPlaying: false,
        playingName: "pause",

        playMode: 0, //0循环播放 1单曲循环 2随机播放
        playModeName: "order",

        playSongList: [],
        playSongListIndex: 0,

        songListDisplay:"none",
        songListAnimation:"songListupAnimation"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 1 获取传入的id
        const id = options.id
        console.log(id)
        this.setData({
            id
        })

        // 2 根据id获取歌曲信息
        // this.getPageData(id)
        this.setupPlayerStoreListener()

        // 3 动态计算内容高度
        const globalData = getApp().globalData
        const contentHeight = globalData.screenHeight - globalData.statusBarHeight - globalData.navBarHeight
        const systemRadio = globalData.systemRadio
        this.setData({
            contentHeight: contentHeight,
            isShowLyric: systemRadio >= 2
        })
    },




    //========================== 事件处理 ==========================
    handleSwiperChange: function (event) {
        const current = event.detail.current
        this.setData({
            currentPage: current
        })
    },
    handleSliderValue: function (event) {
        // 获取slider变化的值
        const value = event.detail.value

        // 计算需要播放的currentTime 
        const currentTime = value / 100 * this.data.durationTime
        // 设置context播放currentTime位置的歌曲
        // audioContext.pause()
        audioContext.seek(currentTime / 1000) //currentTime参数以秒为单位

        //设置最新的sliderValue,并将isSliderChanging设置为false
        this.setData({
            sliderValue: value,
            isSliderChanging: false
        })
        playerStore.setState(
            "isSliderChanging",false
        )
    },
    handleSliderChanging: function (event) {
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({
            isSliderChanging: true,
            currentTime
        })
    },

    handleBackBtnClick: function () {
        wx.navigateBack({
            delta: 1,
        })
    },

    handleModeBtnClick: function () {
        let playMode = this.data.playMode + 1
        if (playMode === 3) {
            playMode = 0
        }
        playerStore.setState(
            "playMode", playMode
        )
    },

    handlePlayBtnClick: function () {
        const isPlaying = !this.data.isPlaying
        this.setData({
            isPlaying
        })
        playerStore.dispatch("changeMusicPlayStatusAction", isPlaying)
    },

    handleMusicListClick() {
            this.setData({
                songListDisplay:"block",
                songListAnimation:"songListupAnimation"
            })
        console.log(this.data.songListAnimation)
       
    },

    handleCloseList(){
        this.setData({
            songListAnimation:"songListdownAnimation",
            songListDisplay:"none",
        })
    },

    changeNewMusicNextAction: function () {
        playerStore.dispatch("changeNewMusicAction", true)
    },

    changeNewMusicPrevAction: function () {
        playerStore.dispatch("changeNewMusicAction", false)
    },

    // 以下為重构过的代码
    // ========================== 数据监听 ==========================
    setupPlayerStoreListener: function () {
        playerStore.onStates(["currentSong", "durationTime", "lyricInfo"], ({
            currentSong,
            durationTime,
            lyricInfo
        }) => {
            if (currentSong) this.setData({
                currentSong
            })
            if (durationTime) this.setData({
                durationTime
            })
            if (lyricInfo) this.setData({
                lyricInfo
            })
        })
        //========================== Audio事件监听 ==========================
        playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText", "sliderValue", "lyricScrollTop", "isSliderChanging"], ({
                currentTime,
                currentLyricIndex,
                currentLyricText,
                sliderValue,
                lyricScrollTop,
                isSliderChanging
            }) => {
                if (currentTime) this.setData({
                    currentTime
                })
                if (currentLyricIndex) this.setData({
                    currentLyricIndex
                })
                if (currentLyricText) this.setData({
                    currentLyricText
                })
                if (sliderValue) this.setData({
                    sliderValue
                })
                if (lyricScrollTop) this.setData({
                    lyricScrollTop
                })
                if (isSliderChanging) this.setData({
                    isSliderChanging
                })
            }),
            playerStore.onStates(["playMode", "isPlaying"], ({
                playMode,
                isPlaying
            }) => {
                if (playMode !== undefined) {
                    this.setData({
                        playMode,
                        playModeName: playModeNames[playMode]
                    })
                }
                if (isPlaying !== undefined) {
                    this.setData({
                        isPlaying,
                        playingName: isPlaying ? "pause" : "resume"
                    })
                }
            }),
            playerStore.onStates(["playSongList", "playSongListIndex"], ({
                playSongList,
                playSongListIndex
            }) => {
                if (playSongList !== undefined) this.setData({
                    playSongList
                })
                if (playSongListIndex !== undefined) this.setData({
                    playSongListIndex
                })

            })

    },

    onUnload: function () {

    },


})