export default function(selector){
    return new Promise((resolve) =>{
        const query = wx.createSelectorQuery()
        // 通过wx.createSelectorQuery方法动态获取轮播图高度
        // 查找图片组件的矩形的信息
        query.select(selector).boundingClientRect()
        query.exec((res) =>{
            // console.log(res[0])
            resolve(res)
        })
    })
   
}