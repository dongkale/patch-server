export function findKeyValueByValue(obj, targetValue) {
  for (const key in obj) {
    if (obj[key] === targetValue) {
      return { key: key, value: obj[key] };
    }
  }
  return {}; // targetValue가 obj에 없는 경우
}
