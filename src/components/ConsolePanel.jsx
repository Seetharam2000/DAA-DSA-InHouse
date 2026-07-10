export default function ConsolePanel({ tests, status }) {
  return (
    <div className="rounded-[24px] border border-border bg-bg-editor/90 p-4">
      <div className="mb-3 flex items-center justify-between text-sm text-text-muted">
        <span>Test lane</span>
        <span>{status}</span>
      </div>
      <div className="space-y-2">
        {tests.map((test) => (
          <div key={test.id} className="flex items-center justify-between rounded-2xl border border-border bg-bg-panel/70 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${test.state === 'pass' ? 'bg-mint' : test.state === 'fail' ? 'bg-coral' : 'bg-amber'}`} />
              <span className="text-text">{test.label}</span>
            </div>
            <span className="text-text-muted">{test.state === 'pass' ? 'passed' : test.state === 'fail' ? 'failed' : 'pending'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
