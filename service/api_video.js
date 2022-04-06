import qnRequest from './index'

export function getTopMV(offset, limit = 10) {
    qnRequest.get("/top/mv", {
        offset,
        limit
    })
}

// 请求MV的详细地址
export function getMVURL(id){
    return qnRequest.get("/mv/url",{
        id
    })
}

// 请求MV的详情
export function getMVDetail(mvid){
    return qnRequest.get("/mv/detail",{
        mvid
    })
}

//请求相关MV
export function getRelatedVideo(id){
    return qnRequest.get("/related/allvideo",{
        id
    })
}