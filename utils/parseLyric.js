// 正则表达式：字符串搭配
//[03:19.320]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
    const lyricStrings = lyricString.split("\n")
    const lyricInfos = []

    for (let lineString of lyricStrings) {
        // 1 获取时间
        const timeResult = timeRegExp.exec(lineString)
        // 如果timeResult为空 就进行下次循环
        if(!timeResult) continue
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        const millsecondTime = timeResult[3] * 1
        const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1

        const time = minute + second + millsecond


        // 2 获取歌词文本
        const text = lineString.replace(timeRegExp, " ")
        lyricInfos.push({
            time,
            text
        })
    }

    return lyricInfos
}