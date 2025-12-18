import React, { useState, useEffect } from 'react';
import { VoiceProvider } from './context/VoiceContext';
import { VoiceCommandProvider, useVoiceCommand } from './context/VoiceCommandContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisResult from './components/AnalysisResult';
import ChatAssistant from './components/ChatAssistant';
import SettingsModal from './components/SettingsModal';
import FloatingVoiceButton from './components/FloatingVoiceButton';
import AccessibilityPanel from './components/AccessibilityPanel';
import OnboardingTutorial from './components/OnboardingTutorial';
import VoiceCommandPanel from './components/VoiceCommandPanel';

function AppContent() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { registerCommandHandler, unregisterCommandHandler } = useVoiceCommand();

  // Settings State
  const [settings, setSettings] = useState({
    geminiKey: '',
    ollamaModel: 'llama3',
    ollamaUrl: 'http://localhost:11434'
  });

  // Register app-level voice command handlers
  useEffect(() => {
    // Settings commands
    registerCommandHandler('openSettings', () => setShowSettings(true));
    registerCommandHandler('closeSettings', () => setShowSettings(false));

    return () => {
      unregisterCommandHandler('openSettings');
      unregisterCommandHandler('closeSettings');
    };
  }, [registerCommandHandler, unregisterCommandHandler]);

  return (
    <>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
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

        <FloatingVoiceButton />
        <AccessibilityPanel />
        <OnboardingTutorial />
        <VoiceCommandPanel />
      </div>
    </>
  );
}

function App() {
  return (
    <VoiceProvider>
      <VoiceCommandProvider>
        <AppContent />
      </VoiceCommandProvider>
    </VoiceProvider>
  );
}

export default App;
