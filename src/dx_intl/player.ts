import { assertNonEmpty, assertBetween } from "../utils.js"

interface PlayerParseResultBase {
  card_name: string
  rating: number
  // Who did not play the new version yet
  // will stay the previous rating
  rating_legacy: boolean
  title: string
  trophy: "normal" | "bronze" | "silver" | "gold" | "rainbow"
}

export interface PlayerParseResultLegacy extends PlayerParseResultBase {
  grade: number
}

export interface PlayerParseResultNew extends PlayerParseResultBase {
  course_rank: number
  class_rank: number
}

const isLegacyRating = (rating: number, ref: string): boolean =>
  (ref === "green" && rating < 3000) ||
  (ref === "orange" && rating < 4000) ||
  (ref === "red" && rating < 7000) ||
  (ref === "purple" && rating < 10000) ||
  (ref === "bronze" && rating < 12000) ||
  (ref === "silver" && rating < 13000) ||
  (ref === "gold" && rating < 14000) ||
  (ref === "rainbow" && rating < 15000)

const parsePlayer = (
  content: string | HTMLDocument
): PlayerParseResultLegacy | PlayerParseResultNew => {
  const document =
    typeof content === "string"
      ? new DOMParser().parseFromString(content, "text/html")
      : content

  const cardName = document.querySelector(".name_block")?.textContent ?? ""
  // On marquee mode, the title will use another HTML structure...
  const title =
    document.querySelector(
      ".trophy_inner_block > span, .trophy_inner_block > div > div"
    )?.textContent ?? "".trim()
  const trophy = (document
    .querySelector(".trophy_block")
    ?.className.match(/Normal|Bronze|Silver|Gold|Rainbow/) ?? [
    "",
  ])[0].toLowerCase()
  const ratingBlock = document.querySelector(".rating_block")
  const rawRating = ratingBlock?.textContent ?? ""
  const ratingImageRef = (document
    .querySelector('img[src *= "/img/rating_base_"]')
    ?.getAttribute("src")
    ?.match(/_([a-z]+)\.png/) ?? ["", ""])[1]
  const rawCourseRank = (document
    .querySelector('img[src *= "/img/course/"]')
    ?.getAttribute("src")
    ?.match(/course_rank_([0-9]{2})/) ?? ["", ""])[1]
  const rawClassRank = (document
    .querySelector('img[src *= "/img/class/"]')
    ?.getAttribute("src")
    ?.match(/_([0-9]{2})/) ?? ["", ""])[1]
  const rawGrade = (document
    .querySelector('img[src *= "/img/grade_"]')
    ?.getAttribute("src")
    ?.match(/grade_([0-9]{2})/) ?? ["", ""])[1]
  assertNonEmpty(cardName, "card_name")
  assertNonEmpty(title, "title")
  assertNonEmpty(trophy, "trophy")
  assertNonEmpty(rawRating, "rating")
  assertNonEmpty(ratingImageRef, "ratingImageRef")

  if (
    rawGrade.length === 0 &&
    (rawCourseRank.length === 0 || rawClassRank.length === 0)
  ) {
    throw new Error("Cannot get the course/class ranks!")
  }

  // To make TypeScript happy
  if (
    trophy !== "normal" &&
    trophy !== "bronze" &&
    trophy !== "silver" &&
    trophy !== "gold" &&
    trophy !== "rainbow"
  ) {
    throw new Error("trophy does not provide a valid value")
  }

  const rating = parseInt(rawRating, 10)

  if (rawGrade.length > 0) {
    // old record, assert rating 14999
    const grade = parseInt(rawGrade, 10)
    assertBetween(rating, 0, 14999, "rating")
    assertBetween(grade, 1, 25, "grade")
    return {
      card_name: cardName,
      title,
      trophy,
      rating,
      rating_legacy: isLegacyRating(rating, ratingImageRef),
      grade,
    }
  }
  const courseRank = parseInt(rawCourseRank, 10)
  const classRank = parseInt(rawClassRank, 10)
  assertBetween(rating, 0, 17000, "rating")
  assertBetween(courseRank, 0, 22, "courseRank")
  assertBetween(classRank, 0, 25, "classRank")
  if (courseRank === 11) {
    throw new Error("11 is not a expected course rank value")
  }
  return {
    card_name: cardName,
    title,
    trophy,
    rating,
    rating_legacy: isLegacyRating(rating, ratingImageRef),
    course_rank: courseRank,
    class_rank: classRank,
  }
}

export default parsePlayer
