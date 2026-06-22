// page-hook/03-hook-control.js
//
// The actual fetch/XHR monkey-patching, fully reversible. enableHook()
// installs the patch; disableHook() restores the saved originals from
// 01-core.js. Both are idempotent - safe to call repeatedly.

(function () {
  const ns = window.__XDL__;
  if (!ns) return;

  function enableHook() {
    if (ns.hookActive) return;
    ns.hookActive = true;

    window.fetch = function (...args) {
      const promise = ns.origFetch.apply(this, args);
      try {
        const reqUrl = typeof args[0] === 'string' ? args[0] : args[0] && args[0].url;
        if (reqUrl && reqUrl.includes('/graphql/')) {
          promise
            .then((res) => res.clone().json())
            .then(ns.announce)
            .catch(() => {
              /* not JSON, or already consumed - ignore */
            });
        }
      } catch (e) {
        /* never let our hook break the page's own requests */
      }
      return promise;
    };

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.__xdlUrl = url;
      return ns.origXHROpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      if (this.__xdlUrl && String(this.__xdlUrl).includes('/graphql/')) {
        this.addEventListener('load', function () {
          try {
            ns.announce(JSON.parse(this.responseText));
          } catch (e) {
            /* not JSON - ignore */
          }
        });
      }
      return ns.origXHRSend.apply(this, args);
    };
  }

  function disableHook() {
    if (!ns.hookActive) return;
    ns.hookActive = false;
    window.fetch = ns.origFetch;
    XMLHttpRequest.prototype.open = ns.origXHROpen;
    XMLHttpRequest.prototype.send = ns.origXHRSend;
  }

  ns.enableHook = enableHook;
  ns.disableHook = disableHook;
})();
