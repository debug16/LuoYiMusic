import isFinite from "lodash/isFinite.js"
// import type isFinite1 from '@types/lodash/isFinite'
/**
 * 格式话时间
 * @param {Number} time 需要格式话的时间
 * @returns {String} 格式话后的时间 00:00:00
 */
export const formateTime = (time: number) => {
  if (!isFinite(time)) return null
  const h = parseInt(Math.floor(time / 3600) + '')
  const minute = parseInt(Math.floor(time / 60 % 60) + '')
  const second = Math.ceil(Math.floor(time % 60))
  const hours = h < 10 ? '0' + h : h
  const formatSecond = second > 59 ? 59 : second
  return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
}