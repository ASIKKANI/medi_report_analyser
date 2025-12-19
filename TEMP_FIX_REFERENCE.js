// This is a temporary fix script
// The issue: Line 59 has a redundant setLoading(true) call inside the map loop
// This needs to be removed since we already set loading at line 45

// The analyzeBatch function should look like this:
const analyzeBatch = async () => {
    if (!text) return;
    if (!settings.ollamaModel && !settings.geminiKey) {
        setError("No AI Provider configured. Please add Gemini API Key or enable Ollama.");
        return;
    }

    setLoading(true);  // LINE 45 - CORRECT
    setError(null);

    const promptConfigs = {
        brief: "Provide a 1-2 sentence high-level summary of the health status. Minimalist and fast.",
        simple: "Explain findings in simple, non-technical language for a general user. Use bullet points and focus on lifestyle impact.",
        detailed: "Provide a deep clinical analysis. Explain the biological significance of each metric, potential correlations, and detailed medical insights."
    };

    // Generate all three modes in parallel
    const modes = ['brief', 'simple', 'detailed'];
    const promises = modes.map(async (mode) => {
        if (modeAnalyses[mode]) return; // Skip if already generated

        // LINE 59 - REMOVE THIS: setLoading(true);
        try {
            const prompt = `You are a medical assistant performing a ${mode.toUpperCase()} analysis.\n\nINSTRUCTIONS:\n${promptConfigs[mode]}\n\nReport Text:\n"${text}"`;

            let result = "";
            if (settings.geminiKey) {
                result = await generateGeminiResponse(settings.geminiKey, [], prompt, text, getAILanguageInstruction());
            } else {
                result = await generateOllamaResponse(prompt, settings.ollamaModel, settings.ollamaUrl, getAILanguageInstruction());
            }

            setModeAnalyses(prev => ({ ...prev, [mode]: result }));
            if (mode === activeTab) setAnalysis(result);
        } catch (err) {
            console.error(`Error in ${mode} analysis:`, err);
        }
    });

    try {
        await Promise.all(promises);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
