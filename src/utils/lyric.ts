/**
 * 格式化歌词
 *
 * @param lyr 歌词
 * @return 
 */
export const formatLyric = (lyr: string) => {
  if (lyr.trim().length < 1) return
  const lyrArr: { time: number; text: string; }[] = [];
  lyr.split('\n').forEach((item) => {
    const time = item.match(/\[(\d{2}):(\d{2})\.(\d{2,})\](.+)/);
    if (time && time[4].trim() !== '') {
      const min = parseInt(time[1], 10);
      const sec = parseInt(time[2], 10);
      const ms = parseInt(time[3], 10);
      const text = item.replace(/\[(\d{2}):(\d{2})\.(\d{2,})\]/g, '');
      lyrArr.push({
        time: min * 60 + sec + ms / 1000,
        text
      })
    }
  })
  return lyrArr
}