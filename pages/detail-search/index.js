// pages/detail-search2/index.js
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'
import {
    getSearchHot,
    getSearchSuggest,
    getSearchResult
} from '../../service/api_search'

// 防抖 不要那么频繁地向服务器请求
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeysWords: [],
        suggestSongs: [],
        searchValue: [],
        suggestSongsNodes: [],
        resultSongs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData()
    },
    // 发送网络请求
    getPageData: function () {
        getSearchHot().then(res => {
            this.setData({
                hotKeysWords: res.result.hots
            })
        })

    },

    // 事件处理
    handleSearchChange(event) {
        const searchValue = event.detail
        this.setData({
            searchValue
        })

        // 如果输入框地内容为空
        if (!searchValue) {
            this.setData({
                suggestSongs: [],
                resultSongs: []
            })
            debounceGetSearchSuggest.cancel()
            return
        }

        debounceGetSearchSuggest(searchValue).then(res => {
            const suggestSongs = res.result.allMatch
            this.setData({
                suggestSongs
            })
            // 如果没有值 就返回
            if(!suggestSongs) return

            // 转成nodes节点
            const suggestkeywords = suggestSongs.map(item => item.keyword)
            const suggestSongsNodes = []
            for (const keyword of suggestkeywords) {
                const nodes = stringToNodes(keyword, searchValue)
                suggestSongsNodes.push(nodes)
            }

            this.setData({
                suggestSongsNodes
            })
        })
    },
    handleSearchAction() {
        const searchValue = this.data.searchValue
        getSearchResult(searchValue).then(res => {
            this.setData({
                resultSongs: res.result.songs
            })
        })
    },

    handleSuggestClick(event) {
        const index = event.currentTarget.dataset.index
        // 拿到點擊的关键字
        const song = this.data.suggestSongs[index].keyword
        this.setData({
            searchValue: song
        })
        // 发送请求
        this.handleSearchAction()
    },
    handleItemClick(event) {
        // 拿到所点击歌曲的名字
        const keyword = event.currentTarget.dataset.keyword
        this.setData({
            searchValue: keyword
        })
        // 发送请求
        this.handleSearchAction()
    },

    onUnload: function () {

    }

})