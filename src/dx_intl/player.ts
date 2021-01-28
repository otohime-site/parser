import { assertNonEmpty, assertBetween } from '../utils'

export interface PlayerParseResult {
  card_name: string
  grade: number
  rating: number
  title: string
  trophy: 'normal' | 'bronze' | 'silver' | 'gold' | 'rainbow'
}

const parsePlayer = (content: string | HTMLDocument): PlayerParseResult => {
  const document = (typeof content === 'string')
    ? new DOMParser().parseFromString(content, 'text/html')
    : content

  const cardName = document.querySelector('.name_block')?.textContent ?? ''
  // On marquee mode, the title will use another HTML structure...
  const title = document.querySelector('.trophy_inner_block > span, .trophy_inner_block > div > div')?.textContent ?? ''.trim()
  const trophy = (document.querySelector('.trophy_block')?.className.match(/Normal|Bronze|Silver|Gold|Rainbow/) ?? [''])[0].toLowerCase()
  const ratingBlock = document.querySelector('.rating_block')
  const rawRating = ratingBlock?.textContent ?? ''
  const rawGrade = (document.querySelector('img[src *= "/img/grade_"]')?.getAttribute('src')?.match(/grade_([0-9]{2})/) ?? ['', ''])[1]
  assertNonEmpty(cardName, 'card_name')
  assertNonEmpty(title, 'title')
  assertNonEmpty(trophy, 'trophy')
  assertNonEmpty(rawRating, 'rating')
  assertNonEmpty(rawGrade, 'grade')

  // To make TypeScript happy
  if (trophy !== 'normal' && trophy !== 'bronze' && trophy !== 'silver' && trophy !== 'gold' && trophy !== 'rainbow') {
    throw new Error('trophy does not provide a valid value')
  }

  const rating = parseInt(rawRating, 10)
  const grade = parseInt(rawGrade, 10)
  assertBetween(rating, 0, 14999, 'rating')
  assertBetween(grade, 1, 25, 'grade')

  return {
    card_name: cardName,
    title,
    trophy,
    rating,
    grade
  }
}

export default parsePlayer
