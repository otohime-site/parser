const cheerio = require('cheerio');
require('buffer');
Stream = require('stream');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = async function() {
  var result = {};

  // Get the main page.
  var res = await fetch('https://maimai-net.com/maimai-mobile/home/', { credentials: "same-origin" });
  var $ = cheerio.load(await res.text());
  result['cardName'] = $('.status_data div:first-child a').text();
  result['title'] = $('.status_data div:nth-child(2) span').text();
  var rawRating = $('.status_data div:nth-child(3) span').text();
  var ratingFound = rawRating.match(/([0-9]+\.[0-9]+)[^0-9]+([0-9]+\.[0-9]+)/);
  result['rating'] = ratingFound[1];
  result['maxRating'] = ratingFound[2];
  result['class'] = $('.f_r img').attr('src').split('/').pop().match(/[0-9]+\_[0-9]+/)[0];
  await sleep(1000);

  // Get all song results.
  var difficulties = ['easy', 'basic', 'advanced', 'expert', 'master', 'remaster'];
  var body = new URLSearchParams();
  body.set('genre', '99');
  body.set('level', '2');
  body.set('word', '1');
  body.set('x', '50');
  body.set('y', '10');
  for (var d = 1; d <= difficulties.length; d++) {
    var difficulty = difficulties[d];
    var res = await fetch('https://maimai-net.com/maimai-mobile/music/'+ difficulty +'Genre/', {
      method: 'POST', body: body
    });
    var $ = cheerio.load(await res.text());
    var category = '';
    result[scores] = [];
    $('#accordion > div, #accordion > h3').each(function() {
      if (this.tagName == 'DIV') {
        category = $(this).find('span').text();
        return;
      }
      var $this = $(this);
      var score = {};
      score.category = category;
      score.difficulty = d;
      var $title = $this.find('div:first-child');
      if ($title.length > 0) {
        score.songName = $this.find('div:first-child').text();
        score.score = $this.find('.achievement').text().match(/[0-9]+\.[0-9]+/)[0];
        var flags = [];
        $this.find('.text_r img').each(function() {
          var src = $(this).attr('src');
          var srcFound = src.match('(fc_silver|fc_gold|ap|100)\.png');
          if (srcFound) {
            flags.push(srcFound[1]);
          }
        });
        score.flag = flags.join("|");
      } else {
        score.songName = $this.text().trim();
        score.score = "0";
      }
      result[scores].push(score);
    });
    await sleep(1000);
  }
  return result;
};
