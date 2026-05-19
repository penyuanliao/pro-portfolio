/**
 * 取得圖示的動態路徑
 * @param name 檔案名稱 (不含副檔名)
 */
export const getIconUrl = (name: string) => {
  // 假設圖片存放在 src/assets/expertise/
  // 這裡使用 import.meta.url 確保在不同環境下都能正確解析路徑
  return new URL(`../assets/expertise/${name}.svg`, import.meta.url).href
}

/**
 * 格式化日期為英文月份 (例如: 2009/06 -> June 2009)
 * @param dateStr 日期字串 (YYYY/MM 或 YYYY/MM/DD)
 */
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    const year = parseInt(parts[0])
    const month = parseInt(parts[1])
    const date = new Date(year, month - 1)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }
  return dateStr
}