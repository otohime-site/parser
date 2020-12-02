import parsePlayer from '../src/dx_intl/player'
import parseScores from '../src/dx_intl/scores'

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
    <div class="p_r_5 f_11">MAX：8600</div>
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
    <div class="p_r_5 f_11">MAX：10150</div>
    </div>
  </div>
  <img src="https://maimaidx-eng.com/maimai-mobile/img/grade_21mE7PnCYg.png">
  </div>
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
test('Player should parse successfully', () => {
  expect(parsePlayer(playerContent)).toEqual({
    card_name: 'ＴＥＳＴ',
    title: 'Test Title',
    trophy: 'gold',
    rating: 8500,
    max_rating: 8600,
    grade: 13
  })
})
test('Player should parse successfully if title is a marquee', () => {
  expect(parsePlayer(playerContentWithMarquee)).toEqual({
    card_name: 'ＴＥＳＴ',
    title: '打打打打打打打打打打打打打打打打打打打打打打打打',
    trophy: 'bronze',
    rating: 10100,
    max_rating: 10150,
    grade: 21
  })
})
test('Score should parse successfully', () => {
  expect(parseScores(scoresContent)).toEqual([
    {
      category: 1,
      title: 'Test song 1',
      deluxe: false,
      difficulty: 3,
      score: 99.4738,
      combo_flag: 'fc',
      sync_flag: '',
      level: '12'
    }, {
      category: 1,
      title: 'Test song 2',
      deluxe: true,
      difficulty: 3,
      score: 100.0208,
      combo_flag: 'fc+',
      sync_flag: 'fs',
      level: '13'
    }, {
      category: 1,
      title: 'Test song 2',
      deluxe: false,
      difficulty: 3,
      score: 99.1234,
      combo_flag: '',
      sync_flag: '',
      level: '11'
    }
  ])
})
