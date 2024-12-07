export const getMsUntilEndOfDay = (): number => {
  const now = new Date()
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const seconds = Math.floor(endOfDay.getTime() - now.getTime())

  return seconds
}

export const isWorkday = (): boolean => {
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Return true if the day is between Monday (1) and Friday (5)
  return dayOfWeek >= 1 && dayOfWeek <= 5
}
