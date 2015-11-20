var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Simple Presenter',
  body: 'Press up for forward, down for backward.'
});

main.show();

function navigate(by) {
  ajax(
    {
      url: '<insert your protocol and host in here>/navigate/',
      method: 'post',
      type: 'json',
      data: {by: by}
    },
    function success() {
      Vibe.vibrate('short');
    },
    function failure() {
      Vibe.vibrate('long');
    }
  );
}

main.on('click', 'up', function forward() {
  navigate(1);
});

main.on('click', 'down', function backward() {
  navigate(-1);
});
