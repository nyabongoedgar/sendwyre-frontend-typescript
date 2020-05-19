import React, {useEffect, useState} from 'react';

const scriptUrl = 'https://verify.sendwyre.com/js/widget-loader.js';
const scriptId = 'wyre-widget';

function verifyWyre() {
  
}

function loadScript(onLoad: any) {
  if (document.getElementById(scriptId)) return;
  const script = document.createElement('script');
  script.id = scriptId;
  script.onload = onLoad;
  script.src = scriptUrl;
  document.body.appendChild(script);
  return script;
}

export function WyreWidget({config, open, children}: any) {
  const [wyre, setWyre] = useState();
  const [loaded, setLoaded] = useState(false);
  function openWyre() {
     if (!loaded) { return; }
     //@ts-ignore
     const w = new window.Wyre.Widget(config);
     setWyre(w);
     if (open) { w.open(); };
  }

  useEffect(() => { loadScript(() => { setLoaded(true); }); }, []);
  useEffect(() => { if (!wyre) { return; }; if (open) { wyre.open(); } else {wyre.close();} }, [open]);
  useEffect(() => openWyre(), [config, loaded]);

  return (children);
}