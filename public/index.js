(function () {
  var backKey = 37;
  var backSpaceKey = 8;
  var forwardKey = 39;
  var spaceKey = 32;

  function makeFragmentUrl(num) {
    var str = num.toString();

    while (str.length < 2) {
      str = '0' + str;
    }

    return 'fragments/' + str + '.html';
  }

  function setPageContent(index) {
    return fetch(makeFragmentUrl(index))
      .then(res => res.text())
      .then(content => document.body.innerHTML = content)
      .then(prettyPrint)
      .then(() => console.log(self.notes));
  }

  function navigate(by) {
    var index = (parseInt(document.location.hash.slice(1), 10) || 0) + by;

    if (index < 0) {
      return;
    }

    history.pushState({index: index}, '', '#' + index);
    setPageContent(index);
  }

  window.addEventListener('popstate', function (evt) {
    var index = evt.state.index;

    if (typeof index === 'number' && !isNaN(index)) {
      setPageContent(evt.state.index);
    }
  });

  document.addEventListener('keyup', function (evt) {
    switch (evt.keyCode) {
      case backKey:
      case backSpaceKey:
        navigate(-1);
        break;

      case forwardKey:
      case spaceKey:
        navigate(+1);
        break;

      default:
        console.log(evt.keyCode);
    }
  });

  new EventSource('/emitter').addEventListener('navigate', function (evt) {
    navigate(JSON.parse(evt.data).by);
  });

  navigate(0);
}());
