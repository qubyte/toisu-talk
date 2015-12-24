(function () {
  var backKey = 37;
  var backSpaceKey = 8;
  var forwardKey = 39;
  var spaceKey = 32;
  var templates = document.getElementsByTagName('template');
  var container;

  function setPageContent(index) {
    var template = templates[index];

    if (!template) {
      return;
    }

    var newContainer = document.createElement('div');
    newContainer.appendChild(document.importNode(template.content, true));

    if (container) {
      document.body.replaceChild(newContainer, container);
    } else {
      document.body.appendChild(newContainer);
    }

    container = newContainer;
    prettyPrint();
  }

  function navigate(by) {
    var index = (parseInt(document.location.hash.slice(1), 10) || 0) + by;

    if (index < 0 || index >= templates.length) {
      return;
    }

    history.pushState({index: index}, '', '#' + index);
    setPageContent(index);
  }

  window.addEventListener('popstate', function (evt) {
    var index = evt.state && evt.state.index;

    if (typeof index === 'number' && !isNaN(index)) {
      setPageContent(index);
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
