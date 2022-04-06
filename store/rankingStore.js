import {
    HYEventStore
} from 'hy-event-store'
import {
    getRankingData
} from '../service/api_music'

const rankingMap = {
    0: "newRanking",
    1: "hotRanking",
    2: "originRanking",
    3: "upRanking"
}
const rankingStore = new HYEventStore({
    state: {
        newRanking: {},
        hotRanking: {},
        originRanking: {},
        upRanking: {}
    },
    actions: {
        getRankingDataAction(ctx) {
            for (let i = 0; i < 4; i++) {
                getRankingData(i).then((res) => {
                    // const rankingName = rankingMap[i]
                    // ctx.rankingName = res.playlist
                    switch (i) {
                        case 0:
                            ctx.newRanking = res.playlist
                            break
                        case 1:
                            ctx.hotRanking = res.playlist
                            break
                        case 2:
                            ctx.originRanking = res.playlist
                            break
                        case 3:
                            ctx.upRanking = res.playlist
                            break
                    }
                })
            }

        }
    },
})
export {
    rankingStore,rankingMap
}