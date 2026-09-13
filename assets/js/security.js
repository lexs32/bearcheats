(function() {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('keydown', function(e) {
    if (
      e.key === 'F12' ||
      e.keyCode === 123 ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (
        e.key === 'I' || e.key === 'i' ||
        e.key === 'J' || e.key === 'j' ||
        e.key === 'C' || e.key === 'c' ||
        e.key === 'K' || e.key === 'k'
      )) ||
      ((e.ctrlKey || e.metaKey) && (
        e.key === 'U' || e.key === 'u' ||
        e.key === 'S' || e.key === 's' ||
        e.key === 'P' || e.key === 'p'
      ))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, true);

  try {
    var _noop = function() {};
    ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeLog', 'assert', 'clear', 'count', 'countReset'].forEach(function(m) {
      if (window.console && window.console[m]) window.console[m] = _noop;
    });
  } catch(err) {}

  var devtoolsOpen = false;
  var checkDevTools = function() {
    var t = 160;
    var wDiff = window.outerWidth - window.innerWidth > t;
    var hDiff = window.outerHeight - window.innerHeight > t;
    if (wDiff || hDiff) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#09090b;color:#df923e;font-family:system-ui,-apple-system,sans-serif;font-weight:700;font-size:22px;letter-spacing:0.5px;text-align:center;padding:24px;">SECURITY NOTICE: DEVELOPER TOOLS ARE RESTRICTED.</div>';
      }
    }
  };

  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 1000);

  setInterval(function() {
    (function() {
      return Function('debugger')();
    })();
  }, 250);
})();
