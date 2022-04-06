import qnRequest from './index'

export function getSearchHot() {
    return qnRequest.get('/search/hot')
}
export function getSearchSuggest(keywords) {
    return qnRequest.get('/search/suggest', {
        keywords,
        type: 'mobile'
    })
}
export function getSearchResult(keywords){
    return qnRequest.get('/search', {
        keywords,
    })
}