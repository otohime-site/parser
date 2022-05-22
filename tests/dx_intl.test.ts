import { expect, test } from "@jest/globals"

import parsePlayer from "../src/dx_intl/player"
import parseScores from "../src/dx_intl/scores"

const playerContent = `
<div class="basic_block p_10 p_b_5 f_0">
  <div class="p_l_10 f_l">
    <div class="trophy_block trophy_Gold p_3 t_c f_0">
      <div class="trophy_inner_block f_13">
        <span>Test Title</span>
      </div>
    </div>
    <div>
      <div class="name_block f_l f_14">ＴＥＳＴ</div>
      <div class="f_r t_r f_0">
        <div class="p_r p_3">
          <img src="https://maimaidx-eng.com/maimai-mobile/img/rating_base_rainbow.png" class="h_30 f_r" />
          <div class="rating_block f_11">8500</div>
        </div>
    </div>
  </div>
  <img src="https://maimaidx-eng.com/maimai-mobile/img/grade_13e4SAdtXj.png">
  </div>
</div>
`
const playerContentWithMarquee = `
<div class="basic_block p_10 p_b_5 f_0">
  <div class="p_l_10 f_l">
    <div class="trophy_block trophy_Bronze p_3 t_c f_0">
      <div class="trophy_inner_block f_13">
        <div style="display: block-inline; width: 260px; height: 24px; overflow: hidden;"><div style="float: left; white-space: nowrap; padding: 0px 260px;">打打打打打打打打打打打打打打打打打打打打打打打打</div></div>
      </div>
    </div>
    <div>
      <div class="name_block f_l f_14">ＴＥＳＴ</div>
      <div class="f_r t_r f_0">
        <div class="p_r p_3">
          <img src="https://maimaidx-eng.com/maimai-mobile/img/rating_base_rainbow.png" class="h_30 f_r" />
          <div class="rating_block f_11">10100</div>
        </div>
    </div>
  </div>
  <img src="https://maimaidx-eng.com/maimai-mobile/img/grade_21mE7PnCYg.png">
  </div>
</div>
`
const playerContentNewVersion = `
<div class="see_through_block m_15 m_t_0 p_10 p_r t_l f_0">
	<div class="basic_block p_10 f_0">
		<img src="https://maimaidx.jp/maimai-mobile/img/Icon/513dc5cb9f0ca1c7.png" class="w_112 f_l"/>
		<div class="p_l_10 f_l">
			<div class="trophy_block trophy_Bronze p_3 t_c f_0">
				<div class="trophy_inner_block f_13">
					<span>京都府勢</span>
				</div>
			</div>
		<div class="m_b_5">
			<div class="name_block f_l f_16">ＫＯＩＮＵ</div>
			<div class="f_r t_r f_0">
				<div class="p_r p_3">
					<img src="https://maimaidx.jp/maimai-mobile/img/rating_base_purple.png?ver=1.17" class="h_30 f_r"/>
					<div class="rating_block f_11">5316</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
		<img src="https://maimaidx.jp/maimai-mobile/img/line_01.png" class="user_data_block_line" />
		<div class="clearfix"></div>
		<img src="https://maimaidx.jp/maimai-mobile/img/course/course_rank_01T7GHJvGe.png" class="h_35 f_l"/>
		<img src="https://maimaidx.jp/maimai-mobile/img/class/class_rank_s_04ZqZmdpb8.png" class="p_l_10 h_35 f_l">
		<div class="p_l_10 f_l f_14"><img src="https://maimaidx.jp/maimai-mobile/img/icon_star.png" class="h_30 m_3 v_m"/>×3</div>
		</div>
		<div class="clearfix"></div>
	</div>
	<img src="https://maimaidx.jp/maimai-mobile/img/Chara/a58681dff962bf96.png" class="w_120 m_t_10 f_r"/>
		<div class="comment_block f_l f_12">
		
	</div>
	<div class="clearfix"></div>
</div>
`

const playerContentNewVersionAndRating = `
<div class="see_through_block m_15 m_t_0 p_10 p_r t_l f_0">
	<div class="basic_block p_10 f_0">
		<img src="https://maimaidx.jp/maimai-mobile/img/Icon/513dc5cb9f0ca1c7.png" class="w_112 f_l"/>
		<div class="p_l_10 f_l">
			<div class="trophy_block trophy_Bronze p_3 t_c f_0">
				<div class="trophy_inner_block f_13">
					<span>京都府勢</span>
				</div>
			</div>
		<div class="m_b_5">
			<div class="name_block f_l f_16">ＫＯＩＮＵ</div>
			<div class="f_r t_r f_0">
				<div class="p_r p_3">
					<img src="https://maimaidx.jp/maimai-mobile/img/rating_base_gold.png?ver=1.17" class="h_30 f_r"/>
					<div class="rating_block f_11">14323</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
		<img src="https://maimaidx.jp/maimai-mobile/img/line_01.png" class="user_data_block_line" />
		<div class="clearfix"></div>
		<img src="https://maimaidx.jp/maimai-mobile/img/course/course_rank_01T7GHJvGe.png" class="h_35 f_l"/>
		<img src="https://maimaidx.jp/maimai-mobile/img/class/class_rank_s_04ZqZmdpb8.png" class="p_l_10 h_35 f_l">
		<div class="p_l_10 f_l f_14"><img src="https://maimaidx.jp/maimai-mobile/img/icon_star.png" class="h_30 m_3 v_m"/>×3</div>
		</div>
		<div class="clearfix"></div>
	</div>
	<img src="https://maimaidx.jp/maimai-mobile/img/Chara/a58681dff962bf96.png" class="w_120 m_t_10 f_r"/>
		<div class="comment_block f_l f_12">
		
	</div>
	<div class="clearfix"></div>
</div>
`

const scoresContent = `
<div class="wrapper main_wrapper t_c">
  <div class="screw_block m_15 f_15">POPS &amp; ANIME</div>
  <div class="w_450 m_15 p_r f_0">
    <div class="music_master_score_back pointer p_3">
      <form>
        <div class="music_lv_block f_r t_c f_14">12</div>
        <div class="music_name_block t_l f_13 break">Test song 1</div>
        <div class="music_score_block w_120 t_r f_l f_12">99.4738%</div>
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fc.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_ss.png" class="h_30 f_r">
      </form>
  </div>
  <img src="https://maimaidx-eng.com/maimai-mobile/img/music_standard.png" class="music_kind_icon">
  </div>
  <div class="w_450 m_15 p_r f_0" id="dx_1" style="margin-top:30px">
    <div class="music_master_score_back pointer p_3">
      <form>
        <div class="music_lv_block f_r t_c f_14">13</div>
        <div class="music_name_block t_l f_13 break">Test song 2</div>
        <div class="music_score_block w_120 t_r f_l f_12">100.0208%</div>
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fs.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fcp.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png" class="h_30 f_r">
      </form>
    </div>
  </div>
  <div class="w_450 m_15 p_r f_0" id="sta_1" style="margin-top:30px">
    <div class="music_master_score_back pointer p_3">
      <form>
        <div class="music_lv_block f_r t_c f_14">11</div>
        <div class="music_name_block t_l f_13 break">Test song 2</div>
        <div class="music_score_block w_120 t_r f_l f_12">99.1234%</div>
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png" class="h_30 f_r">
        <img src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png" class="h_30 f_r">
      </form>
    </div>
  </div>
  <div class="screw_block m_15 f_15">niconico ＆ VOCALOID™</div>
</div>
`

test("Player should parse successfully", () => {
  expect(parsePlayer(playerContent)).toEqual({
    card_name: "ＴＥＳＴ",
    title: "Test Title",
    trophy: "gold",
    rating: 8500,
    rating_legacy: true,
    grade: 13,
  })
})
test("Player should parse successfully if title is a marquee", () => {
  expect(parsePlayer(playerContentWithMarquee)).toEqual({
    card_name: "ＴＥＳＴ",
    title: "打打打打打打打打打打打打打打打打打打打打打打打打",
    trophy: "bronze",
    rating: 10100,
    rating_legacy: true,
    grade: 21,
  })
})
test("We should be able to parse the new version player", () => {
  expect(parsePlayer(playerContentNewVersion)).toEqual({
    card_name: "ＫＯＩＮＵ",
    title: "京都府勢",
    trophy: "bronze",
    rating: 5316,
    rating_legacy: true,
    course_rank: 1,
    class_rank: 4,
  })
})
test("We should be able to parse the new version player and rating", () => {
  expect(parsePlayer(playerContentNewVersionAndRating)).toEqual({
    card_name: "ＫＯＩＮＵ",
    title: "京都府勢",
    trophy: "bronze",
    rating: 14323,
    rating_legacy: false,
    course_rank: 1,
    class_rank: 4,
  })
})
test("Score should parse successfully", () => {
  expect(parseScores(scoresContent)).toEqual([
    {
      category: 1,
      title: "Test song 1",
      deluxe: false,
      difficulty: 3,
      score: 99.4738,
      combo_flag: "fc",
      sync_flag: "",
      level: "12",
    },
    {
      category: 1,
      title: "Test song 2",
      deluxe: true,
      difficulty: 3,
      score: 100.0208,
      combo_flag: "fc+",
      sync_flag: "fs",
      level: "13",
    },
    {
      category: 1,
      title: "Test song 2",
      deluxe: false,
      difficulty: 3,
      score: 99.1234,
      combo_flag: "",
      sync_flag: "",
      level: "11",
    },
  ])
})
