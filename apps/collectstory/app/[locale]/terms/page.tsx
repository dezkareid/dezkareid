export default function TermsPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-64) var(--spacing-24)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--font-size-700)', marginBottom: 'var(--spacing-32)' }}>Terms of Service</h1>
      <div style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>Welcome to Collectstory. By using our services, you agree to the following terms and conditions.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>By accessing or using Collectstory, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>2. User Accounts</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>3. Content</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>Users are responsible for the content they upload to Collectstory. We reserve the right to remove any content that violates our policies or is deemed inappropriate.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>4. Termination</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.</p>

        <p style={{ marginTop: 'var(--spacing-48)', fontSize: 'var(--font-size-200)' }}>Last updated: April 9, 2026</p>
      </div>
    </div>
  );
}
