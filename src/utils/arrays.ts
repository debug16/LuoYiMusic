export const getRandom = (arr: Array<any>, n: number) => {
  const copy = arr.slice();  // 复制数组以避免更改原始数组
  const result = [];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * copy.length);  // 随机选择索引
    result.push(copy[index]);  // 将元素添加到结果数组中
    copy.splice(index, 1);  // 从复制数组中删除元素
  }
  return result;
}
