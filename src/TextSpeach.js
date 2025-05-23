import React, { useState, useEffect } from 'react';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rate, setRate] = useState(1); // default: normal speed


useEffect(() => {
  const savedText = localStorage.getItem('savedTTS');
  if (savedText) {
    setText(savedText);
  }

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      const indoVoices = availableVoices.filter(v => v.lang.startsWith('id'));

      setVoices(indoVoices.length > 0 ? indoVoices : availableVoices);

      if (!selectedVoice && indoVoices.length > 0) {
        setSelectedVoice(indoVoices[0]);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }
}, [selectedVoice]);



const speak = () => {
  if (!selectedVoice) {
    alert("Silakan pilih suara terlebih dahulu.");
    return;
  }

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || 'id-ID';
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  } else {
    alert('Browser kamu tidak mendukung Text-to-Speech');
  }
};

const filteredVoices = voices.filter((voice) =>
  voice.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  const pause = () => {
  if ('speechSynthesis' in window && speechSynthesis.speaking) {
    speechSynthesis.pause();
  }
};

const cancel = () => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
};
const saveText = () => {
  localStorage.setItem('savedTTS', text);
  alert('Teks berhasil disimpan!');
};




  return (
      <>
    <h1 className="tts-app-title">🔥 INTRUKSI HOT CCR KARAWANG PLANT</h1>
    <div className="tts-container">
      <div className="tts-card">
        <h1 className="tts-title">🎤 Text to Speech</h1>

        <textarea
          className="tts-textarea"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik teks yang ingin dibacakan..."
        />
        <div className="tts-rate-wrapper">
            <label className="tts-label">
                Kecepatan Bicara: <strong>{rate.toFixed(1)}x</strong>
            </label>
            <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="tts-slider"
            />
         </div>
      <div className="tts-select-wrapper">
        <label className="tts-label">Cari & Pilih Suara:</label>
        
        <div className="tts-input-search-wrapper">
            <span className="tts-input-icon">🔍</span>
            <input
            type="text"
            placeholder="Cari nama suara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tts-input-search"
            />
        </div>
       <select
        className="tts-select"
        onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            setSelectedVoice(voice || null);
        }}
        value={selectedVoice?.name || ''}
        >
        <option value="">Pilih karakter suara...</option>
        {filteredVoices.map((voice, index) => (
            <option key={index} value={voice.name}>
            {voice.name} ({voice.lang})
            </option>
        ))}
        </select>
        </div>
       <div className="tts-button-row">
        <button className="tts-button start" onClick={speak}>
            🔊 Baca Teks Sekarang
        </button>
        <button className="tts-button icon-button pause" onClick={pause} title="Pause">
            ⏸
        </button>
        <button className="tts-button icon-button cancel" onClick={cancel} title="Batal">
            ❌
        </button>
        <button className="tts-button save" onClick={saveText}>
            💾 Simpan Teks
        </button>
        </div>
      </div>
    </div>
     <p className="tts-footer">© DX Teams 2025</p>
    </>
  );
};

export default TextToSpeech;
