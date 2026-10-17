export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto py-8 space-y-8">
      <header className="border-b border-cream-300 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-cocoa-900 mb-3">About Our Calm Approach</h1>
        <p className="text-cocoa-700 text-lg">Designed for clarity, built for people looking to settle down without financial strain.</p>
      </header>
      <section className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 space-y-4 text-cocoa-800 leading-relaxed">
        <h2 className="text-2xl font-semibold text-cocoa-900">How We Read the Numbers</h2>
        <p>Our calculator connects to the <strong>ApiVerve Cost of Living API</strong> (<code>GET /v1/costliving</code>). Each queried state or metro returns a <code>costIndex</code> benchmarked against the US national average of <strong>100</strong>, alongside Consumer Price Index (<code>cpi</code>) figures and <code>usAverageCPI</code>.</p>
        <p>Values above 100 indicate higher than average living costs, while values below 100 highlight places where your earnings offer extra breathing room.</p>
      </section>
    </article>
  );
}