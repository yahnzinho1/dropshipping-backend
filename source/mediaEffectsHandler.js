//Função que aplica tema universal
window.aplicarTemaUniversal = function(nomeTema = "neonBlackGold") {
  let estilo = "";

  if (nomeTema === "neonBlackGold") {
    estilo = `
      :root {
        --gold-neon: #FFD700;
        --black-deep: #0d0d0d;
        --rainbow-gradient: 
          linear-gradient(45deg, red, orange, yellow, green, cyan, blue, violet, red);
      }

      body {
        background-color: var(--black-deep);
        color: var(--gold-neon);
        font-family: 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        animation: rainbowShadow 10s linear infinite;
      }

      * {
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      h1, h2, h3, h4, h5, h6, label {
        color: var(--gold-neon);
        text-shadow: 0 0 5px var(--gold-neon);
      }

      input, textarea, select {
        background-color: #1a1a1a;
        color: var(--gold-neon);
        border: 1px solid var(--gold-neon);
        border-radius: 5px;
        padding: 10px;
        width: 100%;
      }

      button {
        background-color: var(--gold-neon);
        color: var(--black-deep);
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 0 10px var(--gold-neon), 0 0 20px var(--gold-neon);
      }

      button:hover {
        background-color: #e6b800;
      }

      .login-container, .form-container, .produto, .card, .container {
        background-color: #121212;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 0 12px 2px rgba(255, 215, 0, 0.4), 0 0 30px 6px rgba(255, 215, 0, 0.2);
        margin: 15px auto;
      }

      @keyframes rainbowShadow {
        0% { box-shadow: 0 0 15px red; }
        14% { box-shadow: 0 0 15px orange; }
        28% { box-shadow: 0 0 15px yellow; }
        42% { box-shadow: 0 0 15px green; }
        57% { box-shadow: 0 0 15px cyan; }
        71% { box-shadow: 0 0 15px blue; }
        85% { box-shadow: 0 0 15px violet; }
        100% { box-shadow: 0 0 15px red; }
      }
    `;
  } else {
    // Tema padrão leve
    estilo = `
      body {
        background-color: #f4f4f4;
        color: #333;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
    `;
  }

  const tag = document.createElement("style");
  tag.innerHTML = estilo;
  document.head.appendChild(tag);
}








// Função que aplica o tema
window.aplicarTemaOuro = function(tema = "neonBlackGold") {
  const temas = {
    neonBlackGold: `
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #000;
        color: #ffd700;
        animation: rainbowShadow 5s infinite alternate;
      }

      @keyframes rainbowShadow {
        0%   { box-shadow: 0 0 10px red; }
        20%  { box-shadow: 0 0 10px orange; }
        40%  { box-shadow: 0 0 10px yellow; }
        60%  { box-shadow: 0 0 10px green; }
        80%  { box-shadow: 0 0 10px blue; }
        100% { box-shadow: 0 0 10px violet; }
      }

      .login-container, .produto-container, .form-container {
        max-width: 500px;
        margin: 30px auto;
        padding: 20px;
        border-radius: 15px;
        background-color: #111;
        color: #ffd700;
        border: 2px solid #ffd700;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1);
        animation: rainbowShadow 10s infinite alternate;
      }

      h2, h3 {
        color: #ffd700;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
      }

      .input-field {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border-radius: 8px;
        border: 1px solid #ffd700;
        background-color: #222;
        color: #ffd700;
      }

      .button {
        padding: 12px 20px;
        background: linear-gradient(to right, #ffcc00, #ffaa00);
        color: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 0 10px #ffd700;
      }

      .button:hover {
        background: linear-gradient(to right, #ffaa00, #ffcc00);
        box-shadow: 0 0 20px #ffd700;
      }

      .produto {
        border: 1px solid #ffd700;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        background-color: #1a1a1a;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }

      .produto input, .produto textarea {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border-radius: 8px;
        border: 1px solid #ffd700;
        background-color: #222;
        color: #ffd700;
      }

      .status {
        color: #ff4444;
        font-size: 14px;
      }
    `
  };

  let estiloFinal = "";

  if (typeof tema === "string" && temas[tema]) {
    estiloFinal = temas[tema];
  } else if (typeof tema === "object") {
    estiloFinal = tema.css || "";
  } else {
    console.warn("Tema não reconhecido.");
    return;
  }

  const styleTag = document.createElement("style");
  styleTag.innerHTML = estiloFinal;
  document.head.appendChild(styleTag);
}


//////////////////////////////////////////

window.emitePersonalBipe = function(element, eventType, frequency = null, duration = 0.2, volume = 0.4, waveform = 'sine', variationType = null) {
  if (!element || !eventType) return;

  // Mapas de variações baseadas no tipo de evento
  const presets = {
    notification: { frequency: 880, duration: 0.4, waveform: 'triangle', volume: 0.5 },
    error:        { frequency: 180, duration: 0.6, waveform: 'sawtooth', volume: 0.7 },
    click:        { frequency: 400, duration: 0.1, waveform: 'square', volume: 0.4 },
    contextmenu:  { frequency: 320, duration: 0.12, waveform: 'square', volume: 0.3 },
    input:        { frequency: 500, duration: 0.05, waveform: 'sine', volume: 0.2 },
    success:      { frequency: 660, duration: 0.3, waveform: 'triangle', volume: 0.4 },
    warning:      { frequency: 240, duration: 0.5, waveform: 'sawtooth', volume: 0.6 },
    hover:        { frequency: 520, duration: 0.08, waveform: 'sine', volume: 0.2 },
    submit:       { frequency: 740, duration: 0.2, waveform: 'triangle', volume: 0.5 }
    // Adicione até 50 variações aqui se quiser
  };

  const context = new (window.AudioContext || window.webkitAudioContext)();

  const playBip = (config) => {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = config.waveform || waveform;
    osc.frequency.setValueAtTime(config.frequency || frequency || 440, context.currentTime);
    gain.gain.setValueAtTime(config.volume || volume, context.currentTime);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();
    osc.stop(context.currentTime + (config.duration || duration));
  };

  const baseConfig = presets[variationType || eventType] || {
    frequency: frequency || 440,
    duration,
    waveform,
    volume
  };

  // Bind no elemento
  element.addEventListener(eventType, () => playBip(baseConfig));
}
/*
emitePersonalBipe(document.querySelector("#meuBotao"), "click", null, null, null, null, "click");
emitePersonalBipe(document.querySelector("#notifier"), "customNotifyEvent", null, null, null, null, "notification");
emitePersonalBipe(document.querySelector("#meuInput"), "invalid", null, null, null, null, "error");
emitePersonalBipe(document.body, "dblclick", 970, 0.3, 0.6, "sawtooth");
*/


