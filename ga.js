(function(){
  const TRACKING_ID = 'UA-39487999-9';
  const ENDPOINT = 'https://www.google-analytics.com/collect';
  const CLIENT_ID_KEY = 'ga_client_id';

  // Generates a random UUIDv4 string for client id
  function generateCid() {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf, b => b.toString(16).padStart(2, '0'));
    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join('')
    ].join('-');
  }

  function getClientId(callback) {
    if (!chrome?.storage?.local) {
      callback(generateCid());
      return;
    }
    chrome.storage.local.get(CLIENT_ID_KEY, (result) => {
      const existing = result?.[CLIENT_ID_KEY];
      if (existing) {
        callback(existing);
        return;
      }
      const cid = generateCid();
      chrome.storage.local.set({ [CLIENT_ID_KEY]: cid }, () => callback(cid));
    });
  }

  function sendPageview(cid) {
    const payload = new URLSearchParams();
    payload.set('v', '1');
    payload.set('tid', TRACKING_ID);
    payload.set('cid', cid);
    payload.set('t', 'pageview');
    payload.set('dl', location.href);
    payload.set('dt', document.title || 'popup');
    payload.set('ul', navigator.language || 'en');
    payload.set('cd1', chrome?.runtime?.id || 'unknown_extension');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
      keepalive: true
    }).catch(() => {
      // Best-effort analytics; ignore errors
    });
  }

  getClientId(sendPageview);
})();
