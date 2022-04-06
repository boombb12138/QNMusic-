import qnRequest from './index'

export function getSongDetail(ids) {
    return qnRequest.get("/song/detail", {
        ids
    })
}

export function getSongLyric(id) {
    return qnRequest.get("/lyric", {
        id
    })
}