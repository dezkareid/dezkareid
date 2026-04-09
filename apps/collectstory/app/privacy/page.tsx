export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-64) var(--spacing-24)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--font-size-700)', marginBottom: 'var(--spacing-32)' }}>Privacy Policy</h1>
      <div style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use Collectstory.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>We collect information you provide directly to us when you create an account, upload content, or contact us for support. This may include your username, email address, and any profile information you choose to share.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>2. How We Use Your Information</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>We use the information we collect to provide and improve our services, communicate with you, and personalize your experience. We do not sell your personal information to third parties.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>3. Public Information</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>Items and collections you set to "Public" are visible to all users. Please consider your privacy when choosing to share content publicly.</p>

        <h2 style={{ fontSize: 'var(--font-size-500)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-32)', marginBottom: 'var(--spacing-16)' }}>4. Security</h2>
        <p style={{ marginBottom: 'var(--spacing-16)' }}>We take reasonable measures to protect your information from unauthorized access, loss, or disclosure. However, no method of transmission over the internet is 100% secure.</p>

        <p style={{ marginTop: 'var(--spacing-48)', fontSize: 'var(--font-size-200)' }}>Last updated: April 9, 2026</p>
      </div>
    </div>
  );
}
