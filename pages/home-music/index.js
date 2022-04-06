// pages/home-pages/index.js


import {
    rankingStore,
    rankingMap,
    playerStore,
    audioContext
} from '../../store/index'



import {
    getBanners,
    getSongMenu,
    getSongMenuDetail
} from '../../service/api_music'
import queryRect from '../../utils/query-rect'

import {
    getUserInfo
} from '../../service/api_login'
// pages/home-profile/index.js


Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        swiperHeight: 140,
        recommendSongs: {},
        hotSongMenu: [],
        recommendSongMenu: [],
        rankings: {
            0: {},
            2: {},
            3: {}
        },
        isPlaying: false,
        playingName: "play",
        playState: "running",

        avatarUrl: '/assets/images/icons/个人头像_o.png',
        nickName: '未登录',
        btnClick: 'handleGetUser',
        issignUpShow: 'block',
        isLogoutShow: 'none',

        songListDisplay:"none",
        songListAnimation:"songListupAnimation",

        playSongList:[],
        playSongListIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // playerStore.dispatch("playMusicBySongIdAction", {
        //     id: 141929735
        // })

        this.getPageData()

        // 发起共享数据请求
        rankingStore.dispatch('getRankingDataAction')

        //从store中 获取共享的数据
        this.setupPlayerStoreListener()


    },

    // 网络请求
    getPageData: function () {
        getBanners().then(res => {
            this.setData({
                banners: res.banners
            })
        })
        getSongMenu().then(res => {
            this.setData({
                hotSongMenu: res.playlists
            })
        })
        getSongMenu("华语").then(res => {
            this.setData({
                recommendSongMenu: res.playlists
            })
        })
    },
    // 事件处理
    // ====================登录模块====================
    handleGetUser: function () {
        this.setData({
            issignUpShow: "none",

        })

        getUserInfo().then((res) => {
            const avatarUrl = res.userInfo.avatarUrl
            const nickName = res.userInfo.nickName
            playerStore.setState("avatarUrl", avatarUrl)
            playerStore.setState("nickName", nickName)
            this.setData({
                isLogoutShow: "block"
            })
        })
        playerStore.onStates(["avatarUrl", "nickName"], ({
            avatarUrl,
            nickName
        }) => {
            this.setData({
                avatarUrl,
                nickName,
            })


        })
    },
    handleLogout: function () {
        this.setData({
            avatarUrl: "/assets/images/icons/个人头像_o.png",
            nickName: "未登录",
            isLogoutShow: "none",
            issignUpShow: 'block'
        })
    },
    // ==================
    handleSearchClick: function () {
        wx.navigateTo({
            url: '/pages/detail-search/index',
        })
    },

    handleMoreClick: function () {
        this.navigateToDetailSongsPage("hotRanking")
    },

    handleRankingItemClick: function (event) {
        const idx = event.currentTarget.dataset.idx
        const rangkingName = rankingMap[idx]
        this.navigateToDetailSongsPage(rangkingName)
    },

    navigateToDetailSongsPage: function (rangkingName) {
        wx.navigateTo({
            url: `/pages/detail-songs/index?ranking=${rangkingName}&type=ranking`,
        })
    },



    handleSwiperImageLoaded: function () {
        // 获取图片组件的高度（获取某一个组件的高度）
        queryRect(".swiper-image").then(res => {
            // if()
            // console.log(res)
            const rect = res[0]
            if (!rect) return
            // console.log(rect.height)
            this.setData({
                swiperHeight: rect.height
            })
        })
    },

    getRankingHandler: function (idx) {
        return (res) => {
            if (Object.keys(res).length === 0) return
            // console.log(idx)
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const songList = res.tracks.slice(0, 3)
            const playCount = res.playCount
            const rankingObj = {
                name,
                coverImgUrl,
                songList,
                playCount
            }
            const newRankings = {
                ...this.data.rankings,
                [idx]: rankingObj
            }
            this.setData({
                rankings: newRankings
            })
        }
    },
    handleItemClick: function (event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.recommendSongs)
        playerStore.setState("playSongListIndex", index)
    },

    handleBtnPauseClick: function () {
        const isPlaying = !this.data.isPlaying
        playerStore.dispatch("changeMusicPlayStatusAction", isPlaying)
    },
    handlePlayBarClick: function () {
        wx.navigateTo({
            url: '/pages/music-player/index',
        })
    },

    // 歌曲列表
    handleMusicListClick() {
        this.setData({
            songListDisplay: "block",
            songListAnimation: "songListupAnimation"
        })
        console.log(this.data.songListAnimation)

    },
    handleCloseList() {
        this.setData({
            songListAnimation: "songListdownAnimation",
            songListDisplay: "none",
        })
    },


    setupPlayerStoreListener: function () {
        // 1.排行榜监听
        rankingStore.onState("hotRanking", (res) => {
            if (!res.tracks) return
            const recommendSongs = res.tracks.slice(0, 6)
            this.setData({
                recommendSongs
            })
        })
        rankingStore.onState('newRanking', this.getRankingHandler(0))
        rankingStore.onState('originRanking', this.getRankingHandler(2))
        rankingStore.onState('upRanking', this.getRankingHandler(3))

        // 2.播放器监听
        playerStore.onStates(["currentSong"], ({
            currentSong
        }) => {
            if (currentSong) {
                this.setData({
                    currentSong
                })
            }
        })

        // 3 首页底部音乐播放栏监听
        playerStore.onStates(["isPlaying"], ({
            isPlaying
        }) => {
            if (isPlaying !== undefined) {
                this.setData({
                    isPlaying,
                    playingName: isPlaying ? "pause" : "play",
                    playState: isPlaying ? "running" : "paused"
                })
            }
        })

        // 4 当前播放歌曲所在列表
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


    }

})