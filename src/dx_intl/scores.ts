import { assertNonEmpty, assertBetween } from "../utils.js"

const LEVELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "7+",
  "8",
  "8+",
  "9",
  "9+",
  "10",
  "10+",
  "11",
  "11+",
  "12",
  "12+",
  "13",
  "13+",
  "14",
  "14+",
  "15",
] as const

export interface ScoresParseEntryWithoutScore {
  category: number
  title: string
  deluxe: boolean
  difficulty: number
  level: (typeof LEVELS)[number]
}
export interface ScoresParseEntryWithScore
  extends ScoresParseEntryWithoutScore {
  score: number
  combo_flag: "" | "fc" | "fc+" | "ap" | "ap+"
  sync_flag: "" | "sync" | "fs" | "fs+" | "fdx" | "fdx+"
}

export type ScoresParseEntry =
  | ScoresParseEntryWithoutScore
  | ScoresParseEntryWithScore

const parseScores = (
  content: string | Document,
  categoryTo = 6,
  withNoScore = false
): ScoresParseEntry[] => {
  const document =
    typeof content === "string"
      ? new DOMParser().parseFromString(content, "text/html")
      : content

  const entries = [
    ...document
      .querySelectorAll(".main_wrapper > .screw_block, .main_wrapper > .w_450")
      .values(),
  ]
  if (entries.length === 0) {
    throw new Error("Cannot read scores!")
  }
  const { result } = entries.reduce<{
    result: ScoresParseEntry[]
    currentCategory: number
  }>(
    (prev, curr) => {
      if (curr.className.includes("screw_block")) {
        // XXX: This assume none of the category will be skipped
        return {
          ...prev,
          currentCategory: prev.currentCategory + 1,
        }
      }
      const rawMusicDifficulty = (curr.className?.match(
        /_(basic|advanced|expert|master|remaster)/
      ) ??
        curr
          .querySelector("div")
          ?.className?.match(/_(basic|advanced|expert|master|remaster)/) ?? [
          "",
          "",
        ])[1]
      const category = prev.currentCategory
      const title = curr.querySelector(".music_name_block")?.textContent ?? ""
      const difficulty = [
        "basic",
        "advanced",
        "expert",
        "master",
        "remaster",
      ].indexOf(rawMusicDifficulty)
      const rawLevel = curr.querySelector(".music_lv_block")?.textContent ?? ""
      // If only one type: determine by .music_kind_icon (standard.png vs dx.png)
      // Two types: determine by id (sta_xx vs dx_xx)
      const rawDeluxe =
        curr.querySelector(".music_kind_icon")?.getAttribute("src") ??
        (curr.id.match(/sta|dx/) ?? [""])[0]
      assertBetween(category, 1, categoryTo, "category")
      assertNonEmpty(title, "title")
      assertBetween(difficulty, 0, 4, "difficulty")
      assertNonEmpty(rawDeluxe, "deluxe")
      assertNonEmpty(rawLevel, "level")

      const deluxe = rawDeluxe === "dx" || rawDeluxe.includes("dx.png")
      const levelIndex = (LEVELS as readonly string[]).indexOf(rawLevel)
      if (levelIndex < 0) {
        throw new Error("Level is not matched!")
      }
      const level = LEVELS[levelIndex]

      const rawScore = (
        curr.querySelector(".music_score_block")?.textContent ?? ""
      ).replace("%", "")
      if (rawScore.length === 0) {
        // Skip if it is not played yet
        return withNoScore
          ? {
              ...prev,
              result: [
                ...prev.result,
                {
                  category,
                  title,
                  deluxe,
                  difficulty,
                  level,
                },
              ],
            }
          : { ...prev }
      }
      const score = parseFloat(rawScore)
      assertBetween(score, 0, 101, "score")

      const flagImages = [...curr.querySelectorAll("img.f_r").values()]
      const flags = flagImages.reduce<{
        combo_flag: "" | "fc" | "fc+" | "ap" | "ap+"
        sync_flag: "" | "sync" | "sync" | "fs" | "fs+" | "fdx" | "fdx+"
      }>(
        (prevFlags, currFlagImg) => {
          const comboMatches = (currFlagImg.getAttribute("src") ?? "").match(
            /(fc|fcp|ap|app)\.png/
          )
          if (comboMatches !== null) {
            switch (comboMatches[1]) {
              case "fc":
                return { ...prevFlags, combo_flag: "fc" }
              case "fcp":
                return { ...prevFlags, combo_flag: "fc+" }
              case "ap":
                return { ...prevFlags, combo_flag: "ap" }
              case "app":
                return { ...prevFlags, combo_flag: "ap+" }
            }
          }
          const syncMatches = (currFlagImg.getAttribute("src") ?? "").match(
            /(sync|fs|fsp|fsd|fsdp)\.png/
          )
          if (syncMatches !== null) {
            switch (syncMatches[1]) {
              case "sync":
                return { ...prevFlags, sync_flag: "sync" }
              case "fs":
                return { ...prevFlags, sync_flag: "fs" }
              case "fsp":
                return { ...prevFlags, sync_flag: "fs+" }
              case "fsd":
                return { ...prevFlags, sync_flag: "fdx" }
              case "fsdp":
                return { ...prevFlags, sync_flag: "fdx+" }
            }
          }
          return { ...prevFlags }
        },
        {
          combo_flag: "",
          sync_flag: "",
        }
      )
      return {
        ...prev,
        result: [
          ...prev.result,
          {
            category,
            title,
            deluxe,
            difficulty,
            level,
            score,
            ...flags,
          },
        ],
      }
    },
    {
      result: [],
      currentCategory: 0,
    }
  )
  return result
}

export default parseScores
