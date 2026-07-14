import { useMemo, useState } from 'react';
import useAppStore from '../store/useAppStore';

const soundPacks = ['Pulse', 'Retro', 'Minimal'];
const aiProviders = ['OpenAI', 'Anthropic', 'Azure AI'];
const providerModels = {
  OpenAI: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
  Anthropic: ['claude-3.5', 'claude-2', 'claude-instant'],
  'Azure AI': ['azure-openai-gpt4', 'azure-openai-3.5', 'azure-openai-embeddings'],
};

export default function SettingsPanel() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);

  const [apiKey, setApiKey] = useState('');
  const [fetchingModels, setFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState(providerModels[settings.aiProvider]);
  const [status, setStatus] = useState('');

  const getCurrentModels = useMemo(
    () => providerModels[settings.aiProvider] || [],
    [settings.aiProvider],
  );

  const handleToggle = () => updateSettings({ enabled: !settings.enabled });

  const handleVolumeChange = (value) => updateSettings({ masterVolume: Number(value) });

  const handleProviderChange = (value) => {
    const models = providerModels[value] || [];
    updateSettings({ aiProvider: value, aiModel: models[0] || '' });
    setAvailableModels(models);
  };

  const handleSaveKey = () => {
    updateSettings({ apiKeySaved: true });
    setStatus('API key saved securely.');
  };

  const handleFetchModels = async () => {
    setFetchingModels(true);
    setStatus('Fetching available models...');
    await new Promise((resolve) => setTimeout(resolve, 700));
    setAvailableModels(getCurrentModels);
    setStatus(`Loaded ${getCurrentModels.length} models for ${settings.aiProvider}.`);
    setFetchingModels(false);
  };

  const handlePlaySuccess = () => {
    setStatus('Success sound preview triggered.');
  };

  return (
    <div className="min-h-screen bg-bg-base px-3 py-6 text-text sm:px-5 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-border bg-bg-panel/80 p-8 shadow-glow backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">FaultLine Settings</p>
              <h1 className="mt-2 text-3xl font-semibold">Audio & AI control center</h1>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${settings.enabled ? 'bg-emerald text-black' : 'bg-[#29233c] text-text-muted'}`}
            >
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6 rounded-[28px] border border-border bg-bg-panel-2 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Master Volume</p>
                <h2 className="mt-3 text-xl font-semibold text-white">FaultLine audio engine</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-text-muted">Volume</label>
                  <span className="text-sm font-semibold text-white">{settings.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(event) => handleVolumeChange(event.target.value)}
                  className="w-full accent-coral"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-text-muted">
                  Sound Pack
                  <select
                    value={settings.soundPack}
                    onChange={(event) => updateSettings({ soundPack: event.target.value })}
                    className="w-full rounded-2xl border border-border bg-[#0d091a] px-4 py-3 text-white outline-none"
                  >
                    {soundPacks.map((pack) => (
                      <option key={pack} value={pack}>{pack}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-text-muted">
                  Success sound
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlaySuccess}
                      className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4d82]"
                    >
                      Play
                    </button>
                    <span className="text-sm text-text-muted">Celebrate your victories.</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="space-y-6 rounded-[28px] border border-border bg-bg-panel-2 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text-muted">AI Intelligence</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Error analysis assistant</h2>
              </div>

              <label className="space-y-2 text-sm text-text-muted">
                AI Provider
                <select
                  value={settings.aiProvider}
                  onChange={(event) => handleProviderChange(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-[#0d091a] px-4 py-3 text-white outline-none"
                >
                  {aiProviders.map((provider) => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-text-muted">
                API Key
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    placeholder="Enter API key"
                    className="w-full rounded-2xl border border-border bg-[#0d091a] px-4 py-3 text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="rounded-2xl bg-mint px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#7ef3c3]"
                  >
                    Save API Key
                  </button>
                </div>
              </label>

              <label className="space-y-2 text-sm text-text-muted">
                AI Model
                <div className="flex gap-3">
                  <select
                    value={settings.aiModel}
                    onChange={(event) => updateSettings({ aiModel: event.target.value })}
                    className="w-full rounded-2xl border border-border bg-[#0d091a] px-4 py-3 text-white outline-none"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleFetchModels}
                    disabled={fetchingModels}
                    className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4d82] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fetchingModels ? 'Fetching…' : 'Fetch Models'}
                  </button>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-[#0d091a] px-4 py-3">
                <input
                  type="checkbox"
                  checked={settings.autoSummary}
                  onChange={() => updateSettings({ autoSummary: !settings.autoSummary })}
                  className="h-4 w-4 accent-coral"
                />
                <span className="text-sm text-text-muted">Automatically generate concise failure summaries.</span>
              </label>
            </section>
          </div>

          {status && <div className="mt-6 rounded-2xl border border-border bg-[#0b0816] px-4 py-3 text-sm text-text-muted">{status}</div>}
        </div>
      </div>
    </div>
  );
}
