import qnRequest from './index'

export function getBanners() {
    return qnRequest.get("/banner", {
        type: 2
    })
}

export function getRankingData(idx) {
    return qnRequest.get("/top/list", {
        idx
    })
}
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
    return qnRequest.get("/top/playlist", {
        cat,
        limit,
        offset
    })
}
export function getSongMenuDetail(id) {
    return qnRequest.get("/playlist/detail/dynamic", {
        id
    })
}