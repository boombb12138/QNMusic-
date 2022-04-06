// components/song-menu-v1/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ''
        },
        songMenu: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleMenuItemClick: function (event) {
            const item = event.currentTarget.dataset.item
            // console.log(item)
            wx.navigateTo({
              url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
            })
        }
    }
})