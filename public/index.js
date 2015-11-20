const backKey = 37;
const backSpaceKey = 8;
const forwardKey = 39;
const spaceKey = 32;

const content = [
  '<h1>async @ async</h1>',
  '<h1>Test 1</h1>',
  '<h1>Test 2</h1>'
]

const domain = document.location

function setPageContent(index) {
  document.body.innerHTML = content[index];
}

function navigate(by) {
  const index = (parseInt(document.location.hash.slice(1), 10) || 0) + by;

  if (index < 0) {
    return;
  }

  history.pushState({index}, '', `#${index}`);
  setPageContent(index);
}

window.addEventListener('popstate', evt => {
  if (typeof evt.state === 'number') {
    setPageContent(evt.state.index || 0);
  }
});

document.addEventListener('keyup', evt => {
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

navigate(0);
