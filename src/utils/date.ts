// 时间戳转时间
export const formatTime = (timeStamp: number) => {
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`
}
// 时间戳转时间
export const formatDate = (timeStamp: number) => {
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}
