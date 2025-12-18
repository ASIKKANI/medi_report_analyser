import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisResult from './components/AnalysisResult';
import ChatAssistant from './components/ChatAssistant';
import SettingsModal from './components/SettingsModal';

function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    geminiKey: '',
    ollamaModel: 'llama3',
    ollamaUrl: 'http://localhost:11434'
  });

  return (
    <div className="app-layout">
      <Navbar onOpenSettings={() => setShowSettings(true)} />

      <main className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        {!file && <Hero />}

        <UploadSection
          onFileProocessed={(text, fileObj) => {
            setFile(fileObj);
            setExtractedText(text);
          }}
          setIsLoading={(loading) => console.log("Processing...", loading)}
        />

        {extractedText && (
          <div className="grid-cols-2" style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
            <AnalysisResult text={extractedText} analysis={analysis} setAnalysis={setAnalysis} settings={settings} />
            <ChatAssistant context={extractedText} analysis={analysis} settings={settings} />
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
