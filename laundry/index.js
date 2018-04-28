/* global fetch:false */
const cheerio = require('react-native-cheerio');

module.exports = async (progress) => {
  const result = {};
  const difficulties = ['easy', 'basic', 'advanced', 'expert', 'master', 'remaster'];

  // Get the main page.
  const rootRes = await fetch('https://maimai-net.com/maimai-mobile/home/', { credentials: 'same-origin' });
  const $r = cheerio.load(await rootRes.text());
  if ($r('.status_data').length < 1) {
    throw new Error('Cannot get user data!');
  }
  result.cardName = $r('.status_data div:first-child a').text();
  result.title = $r('.status_data div:nth-child(2) span').text();
  const rawRating = $r('.status_data div:nth-child(3) span').text();
  const ratingFound = rawRating.match(/([0-9]+\.[0-9]+)[^0-9]+([0-9]+\.[0-9]+)/);
  result.rating = parseFloat(ratingFound[0]);
  result.maxRating = parseFloat(ratingFound[1]);
  [result.class] = $r('.f_r img').attr('src').split('/').pop()
    .match(/[0-9]+_[0-9]+/);
  await progress(100 / (difficulties.length + 1));

  // Get all song results.
  const body = new URLSearchParams();
  body.set('genre', '99');
  body.set('level', '2');
  body.set('word', '1');
  body.set('x', '50');
  body.set('y', '10');
  result.scores = [];
  for (let d = 0; d < difficulties.length; d += 1) {
    const difficulty = difficulties[d];
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(`https://maimai-net.com/maimai-mobile/music/${difficulty}Genre/`, {
      method: 'POST', body, credentials: 'same-origin',
    });
    // eslint-disable-next-line no-await-in-loop
    const $ = cheerio.load(await res.text());
    let category = '';
    if ($('#accordion').length < 1) {
      throw new Error('Cannot get score data!');
    }
    $('#accordion > div, #accordion > h3').each(function parseScores() {
      const $this = $(this);
      if (this.tagName.search(/^DIV$/i) !== -1) {
        category = $this.find('span').text();
        return;
      }
      const score = {};
      score.category = category;
      score.difficulty = d;
      const $title = $this.find('div:first-child');
      if ($title.length > 0) {
        score.songName = $this.find('div:first-child').text();
        [score.score] = $this.find('.achievement').text().match(/[0-9]+\.[0-9]+/);
        score.score = parseFloat(score.score);
        const flags = [];
        $this.find('.text_r img').each(function parseFlags() {
          const src = $(this).attr('src');
          const srcFound = src.match(/(fc_silver|fc_gold|ap|100)\.png/);
          if (srcFound) {
            flags.push(srcFound[1]);
          }
        });
        score.flag = flags.join('|');
      } else {
        score.songName = $this.text().trim();
        score.score = 0;
      }
      const $next = $this.next('ul');
      if (score.score !== 0) {
        score.rawScore = parseInt($next.find('tr:nth-child(2) td:last-child').text().replace(/,/g, ''), 10);
      } else {
        score.rawScore = 0;
      }
      score.songId = parseInt($next.find('input[name=musicId]').val(), 10);
      result.scores.push(score);
    });
    // eslint-disable-next-line no-mixed-operators, no-await-in-loop
    await progress((2 + d) / (difficulties.length + 1) * 100);
  }
  return result;
};
