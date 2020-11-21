
import { assertNonEmpty, assertBetween } from '../utils'

const LEVELS = [
  '1', '2', '3', '4', '5', '6', '7', '7+', '8',
  '8+', '9', '9+', '10', '10+', '11', '11+',
  '12', '12+', '13', '13+', '14', '14+', '15'] as const

export interface ScoresParseEntry {
  category: number
  title: string
  deluxe: boolean
  difficulty: number
  score: number
  combo_flag: '' | 'fc' | 'fc+' | 'ap' | 'ap+'
  sync_flag: '' | 'fs' | 'fs+' | 'fdx' | 'fdx+'
  level: typeof LEVELS[number]
}

const parseScores = (content: string | HTMLDocument, categoryFrom: number = 1, categoryTo: number = 6): ScoresParseEntry[] => {
  const document = (typeof content === 'string')
    ? new DOMParser().parseFromString(content, 'text/html')
    : content

  const entries = [
    ...document.querySelectorAll('.main_wrapper > .screw_block, .main_wrapper > .w_450').values()
  ]
  if (entries.length === 0) {
    throw new Error('Cannot read scores!')
  }
  const { result } = entries.reduce<{result: ScoresParseEntry[], currentCategory: number}>(
    (prev, curr) => {
      if (curr.className.includes('screw_block')) {
        // XXX: This assume none of the category will be skipped
        return {
          ...prev,
          currentCategory: prev.currentCategory + 1
        }
      }
      const rawScore = (curr.querySelector('.music_score_block')?.textContent ?? '').replace('%', '')
      if (rawScore.length === 0) {
        // Skip if it is not played yet
        return { ...prev }
      }
      const rawMusicDifficulty = (curr.querySelector('div')?.className?.match(/basic|advanced|expert|master|remaster/) ?? [''])[0]
      const category = prev.currentCategory
      const title = curr.querySelector('.music_name_block')?.textContent ?? ''
      const difficulty = ['basic', 'advanced', 'expert', 'master', 'remaster'].indexOf(rawMusicDifficulty)
      const rawLevel = curr.querySelector('.music_lv_block')?.textContent ?? ''
      // If only one type: determine by .music_kind_icon (standard.png vs dx.png)
      // Two types: determine by id (sta_xx vs dx_xx)
      const rawDeluxe = curr.querySelector('.music_kind_icon')?.getAttribute('src') ?? ((curr.id.match(/sta|dx/) ?? [''])[0])
      assertBetween(category, categoryFrom, categoryTo, 'category')
      assertNonEmpty(title, 'title')
      assertBetween(difficulty, 0, 4, 'difficulty')
      assertNonEmpty(rawDeluxe, 'deluxe')
      assertNonEmpty(rawLevel, 'level')
      const score = parseFloat(rawScore)
      const deluxe = (rawDeluxe === 'dx' || rawDeluxe.includes('dx.png'))
      assertBetween(score, 0, 101, 'score')
      const levelIndex = (LEVELS as readonly string[]).indexOf(rawLevel)
      if (levelIndex < 0) { throw new Error('Level is not matched!') }
      const level = LEVELS[levelIndex]

      const flagImages = [...curr.querySelectorAll('img.f_r').values()]
      const flags = flagImages.reduce<{
        combo_flag: '' | 'fc' | 'fc+' | 'ap' | 'ap+'
        sync_flag: '' | 'fs' | 'fs+' | 'fdx' | 'fdx+'
      }>((prevFlags, currFlagImg) => {
        const comboMatches = (currFlagImg.getAttribute('src') ?? '').match(/(fc|fcp|ap|app)\.png/)
        if (comboMatches !== null) {
          switch (comboMatches[1]) {
            case 'fc': return { ...prevFlags, combo_flag: 'fc' }
            case 'fcp': return { ...prevFlags, combo_flag: 'fc+' }
            case 'ap': return { ...prevFlags, combo_flag: 'ap' }
            case 'app': return { ...prevFlags, combo_flag: 'ap+' }
          }
        }
        const syncMatches = (currFlagImg.getAttribute('src') ?? '').match(/(fs|fsp|fsd|fsdp)\.png/)
        if (syncMatches !== null) {
          switch (syncMatches[1]) {
            case 'fs': return { ...prevFlags, sync_flag: 'fs' }
            case 'fsp': return { ...prevFlags, sync_flag: 'fs+' }
            case 'fsd': return { ...prevFlags, sync_flag: 'fdx' }
            case 'fsdp': return { ...prevFlags, sync_flag: 'fdx+' }
          }
        }
        return { ...prevFlags }
      }, {
        combo_flag: '',
        sync_flag: ''
      })
      return {
        ...prev,
        result: [
          ...prev.result,
          {
            category,
            title,
            deluxe,
            difficulty,
            score,
            level,
            ...flags
          }
        ]
      }
    },
    {
      result: [],
      currentCategory: 0
    }
  )
  return result
}

export default parseScores
