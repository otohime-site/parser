import { assertNonEmpty, assertBetween } from "../utils"

export interface PlayerParseResult {
  card_name: string
  grade: number
  rating: number
  max_rating: number
  title: string
  trophy: 'normal' | 'bronze' | 'silver' | 'gold' | 'rainbow'; 
}


const parsePlayer = (htmlContent: string): PlayerParseResult => {
  const document: HTMLDocument = new DOMParser().parseFromString(htmlContent, 'text/html')
  const cardName = document.querySelector('.name_block')?.textContent ?? ''
  const title = document.querySelector('.trophy_inner_block > span')?.textContent ?? ''.trim()
  const trophy = (document.querySelector('.trophy_block')?.className.match(/Normal|Bronze|Silver|Gold|Rainbow/) ?? [''])[0].toLowerCase()
  const ratingBlock = document.querySelector('.rating_block')
  const rawRating = ratingBlock?.textContent ?? ''
  const rawMaxRating = (ratingBlock?.parentElement?.nextElementSibling?.textContent?.match(/([0-9]+)/) ?? [''])[0]
  const rawGrade = (document.querySelector('img[src *= "/img/grade_"]')?.getAttribute('src')?.match(/grade_([0-9]{2})/) ?? ['', ''])[1]
  assertNonEmpty(cardName, 'card_name')
  assertNonEmpty(title, 'title')
  assertNonEmpty(trophy, 'trophy')
  assertNonEmpty(rawRating, 'rating')
  assertNonEmpty(rawMaxRating, 'max_rating')
  assertNonEmpty(rawGrade, 'grade')

  // To make TypeScript happy
  if (trophy !== 'normal' && trophy !== 'bronze' && trophy !== 'silver' && trophy !== 'gold' && trophy !== 'rainbow') {
    throw new Error('trophy does not provide a valid value')
  }

  const rating = parseInt(rawRating, 10)
  const maxRating = parseInt(rawMaxRating, 10)
  const grade = parseInt(rawGrade, 10)
  assertBetween(rating, 0, 14999, 'rating')
  assertBetween(maxRating, 0, 14999, 'max_rating')
  assertBetween(grade, 1, 25, 'grade')

  return {
    card_name: cardName,
    title,
    trophy,
    rating,
    max_rating: maxRating,
    grade
  }
}

export default parsePlayer
