import {getSongVkey} from 'api/singer'
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }
  // 获取歌词vkey,并返回拼接好的歌曲文件路径
  async songFilePath() {
    if (this.FilePath) {
      return Promise.resolve(this.FilePath)
    }
    // 获取歌曲文件的key，拼接成文件路径
    let result = await getSongVkey(this.mid)
    let songFile = result.data.items
    this.FilePath = `http://isure.stream.qqmusic.qq.com/${songFile[0].filename}?guid=7504433754&vkey=${songFile[0].vkey}&fromtag=66`
    return Promise.resolve(this.FilePath)
  }
  // 获取歌词数据
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=7504433754&vkey=${vkey}&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  // join()是在每个元素之间添加字符，输出表现为一个字符串
  return ret.join('/')
}