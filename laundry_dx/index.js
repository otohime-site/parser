/* global fetch:false */
const cheerio = require('react-native-cheerio');

module.exports = async (progress) => {
  const result = {};
  const difficultyCount = 5;

  // Get the main page.
  const rootRes = await fetch('https://maimaidx.jp/maimai-mobile/home/', { credentials: 'same-origin' });
  const $r = cheerio.load(await rootRes.text());
  if ($r('.see_through_block').length < 1) {
    throw new Error('Cannot get user data!');
  }
  result.cardName = $r('.name_block').text();
  result.title = $r('.trophy_inner_block').text().trim();
  const rawRating = $r('.rating_block').text();
  const rawMaxRating = $r('.rating_block').parent().next().text();
  const maxRatingFound = rawMaxRating.match(/([0-9]+)/);
  result.rating = parseInt(rawRating, 10);
  result.maxRating = parseInt(maxRatingFound[0], 10);
  result.class = ''; // XXX: To be done
  await progress(100 / (difficultyCount + 1));

  // Getall song results.
  result.scores = [];
  for (let d = 0; d < difficultyCount; d += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(`https://maimaidx.jp/maimai-mobile/record/musicGenre/search/?genre=99&diff=${d}`, {
      method: 'GET', credentials: 'same-origin',
    });
    // eslint-disable-next-line no-await-in-loop
    const $ = cheerio.load(await res.text());
    let category = '';
    if ($('.screw_block').length < 1) {
      throw new Error('Cannot get score data!');
    }
    // eslint-disable-next-line no-loop-func
    $('.main_wrapper > .screw_block, .main_wrapper > .w_450').each(function parseScores() {
      const $this = $(this);
      if ($this.hasClass('screw_block')) {
        category = $this.text();
        return;
      }
      const score = {};
      score.category = category;
      score.difficulty = d;
      score.songName = $this.find('.music_name_block').text();
      const rawScore = $this.find('.music_score_block:first-child').text().replace('%', '');
      score.score = parseFloat(rawScore || '0');
      score.level = $this.find('.music_lv_block').text();
      if ($this.find('.music_kind_icon').length > 0) {
        score.deluxe = ($this.find('.music_kind_icon').attr('src') || '').indexOf('dx.png') >= 0;
      } else {
        score.deluxe = ($this.attr('id') || '').indexOf('dx') >= 0;
      }

      const flags = [];
      $this.find('img.f_r').each(function parseFlags() {
        const src = $(this).attr('src');
        const srcFound = src.match(/(fc|fcp|ap|app|fs|fsp|fsd|fsdp)\.png/);
        if (srcFound) {
          flags.push(srcFound[1]);
        }
      });
      score.flag = flags.join('|');
      score.songId = $this.find('input[name=idx]').val();
      result.scores.push(score);
    });
    // eslint-disable-next-line no-mixed-operators, no-await-in-loop
    await progress((2 + d) / difficultyCount * 100);
  }
  return result;
};
