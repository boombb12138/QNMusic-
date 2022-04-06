import {
    HYEventStore
} from 'hy-event-store'

import {
    getSongDetail,
    getSongLyric
} from '../service/api_player'

import {
    parseLyric
} from '../utils/parseLyric'


const audioContext = wx.getBackgroundAudioManager()
const playerStore = new HYEventStore({
    state: {
        isFirstPlay: true,
        id: 0,
        currentSong: {},
        durationTime: 0,
        lyricInfo: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: '',

        sliderValue: 0,
        lyricScrollTop: 0,
        isSliderChanging: false,

        playMode: 0,
        isPlaying: false,

        playSongList: [],
        playSongListIndex: 0,
        isSliderChanging: false,

        isStop: false,

        avatarUrl:'',
        nickName:''
    },
    actions: {
        playMusicBySongIdAction(ctx, {
            id,
            isRefresh = false
        }) {
            if (ctx.id === id && isRefresh) {
                this.dispatch("changeMusicPlayStatusAction", true)
                return
            }
            if (ctx.id !== id) {
                ctx.id = id

                // 0 將isPlaying改为播放状态
                ctx.isPlaying = true
                // 重新播放一首歌曲 为避免请求数据还没有返回而展示上一首歌曲的信息
                ctx.currentSong = {}
                ctx.durationTime = 0
                ctx.lyricInfo = []
                ctx.currentTime = 0
                ctx.currentLyricIndex = 0
                ctx.currentLyricText = ''
                //1 請求数据
                // 請求歌曲詳情
                getSongDetail(id).then(res => {
                    ctx.currentSong = res.songs[0]
                    ctx.durationTime = res.songs[0].dt
                    audioContext.title = res.songs[0].name
                })

                // 請求歌詞
                getSongLyric(id).then(res => {
                    const lyric = parseLyric(res.lrc.lyric)
                    ctx.lyricInfo = lyric
                })

                //2 使用audioContext播放歌曲
                audioContext.stop()
                //  变量要写在模板字符串里
                audioContext.src = `http://music.163.com/song/media/outer/url?id=${id}.mp3`
                audioContext.title = ctx.id
                audioContext.autoplay = true

                // 3 监听audioContext的一些事件 只有在第一次才监听
                if (ctx.isFirstPlay) {
                    this.dispatch("setupAudioContextListener")
                    ctx.isFirstPlay = false
                }

                // 4 监听音乐暂停/播放/停止
                audioContext.onPlay(() => {
                    ctx.isPlaying = true
                })
                audioContext.onPause(() => {
                    // if (ctx.isSliderChanging) return
                    ctx.isPlaying = false
                })
                audioContext.onStop(() => {
                    ctx.isPlaying = false
                    ctx.isStop = true
                })
            }
        },

        handleSliderChanging: function (event) {
            const value = event.detail.value
            const currentTime = value / 100 * ctx.durationTime
            ctx.isSliderChanging = true
            ctx.currentTime = currentTime
        },

        changeMusicPlayStatusAction: function (ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            if (!isPlaying) {
                audioContext.pause()
            }
            if (ctx.isPlaying && ctx.isStop) {
                audioContext.src = `http://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                audioContext.title = ctx.id
                audioContext.play()

            }

        },

        setupAudioContextListener: function (ctx) {
            // 1 监听准备好播放
            audioContext.onCanplay(() => {
                audioContext.play()
            })

            // 2 监听时间改变
            audioContext.onTimeUpdate(() => {
                //1  获取当前的时间
                const currentTime = audioContext.currentTime * 1000

                if (!ctx.isSliderChanging) {
                    //2 随着歌曲播放 进度条跟着走
                    const sliderValue = currentTime / ctx.durationTime * 100
                    ctx.sliderValue = sliderValue
                    ctx.currentTime = currentTime
                }
                // 3 根据当前时间去查找播放的歌词
                let i = 0
                for (; i < ctx.lyricInfo.length; i++) {
                    const lyricInfo = ctx.lyricInfo[i]
                    if (currentTime < lyricInfo.time) {
                        const currentIndex = i - 1
                        if (ctx.currentLyricIndex !== currentIndex) {
                            const currentLyricInfo = ctx.lyricInfo[currentIndex]
                            ctx.lyricScrollTop = currentIndex * 35,
                                ctx.currentLyricText = currentLyricInfo.text,
                                ctx.currentLyricIndex = currentIndex
                        }
                        break
                    }
                }
            })

            // 3 监听歌曲播放完成
            audioContext.onEnded(() => {
                this.dispatch("changeNewMusicAction", true)
            })
        },

        changeNewMusicAction(ctx, isNext = true) {
            // 1 獲取当前播放歌曲的下标
            let index = ctx.playSongListIndex

            // 2 根据播放模式来决定下一首歌曲的下标
            switch (ctx.playMode) {
                case 0: // 顺序
                    index = isNext ? index + 1 : index - 1
                    // 如果播放第一首的时候按了上一首
                    if (index === -1) {
                        index = ctx.playSongList.length - 1
                    }
                    // 如果播放最后一首的时候按了下一首
                    if (index === ctx.playSongList.length) {
                        index = 0
                    }
                    ctx.playSongListIndex = index
                    break
                case 1: //单曲
                    break
                case 2:
                    index = Math.floor(Math.random() * ctx.playSongList.length)
                    ctx.playSongListIndex = index
                    break
            }

            // 3 获取歌曲
            let currentSong = ctx.playSongList[index]
            if (!currentSong) currentSong = ctx.currentSong
            // console.log(index)
            // 4 播放歌曲
            this.dispatch("playMusicBySongIdAction", {
                id: currentSong.id,
                isRefresh: true
            })
        },

    }
})



export {
    audioContext,
    playerStore
}