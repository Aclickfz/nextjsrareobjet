import type { ReactNode } from 'react';
import Link from 'next/link';

export function AuthShell({ title, description, mode = 'recovery', children }: { title: string; description?: string; mode?: 'login' | 'register' | 'recovery'; children: ReactNode }) {
  return <main id="main-content" className="auth-page" tabIndex={-1}>
    <div className="auth-frame">
      <aside className="auth-story">
        <Link href="/" className="auth-brand">JustAclick<span>THOUGHTFULLY CURATED LIVING</span></Link>
        <div className="auth-story-copy"><span className="auth-kicker">MAKE YOURSELF AT HOME</span><h2>A little inspiration.<br /> A space that’s yours.</h2><p>Beautiful pieces, saved favourites, and the details that make a house your home.</p></div>
        <div className="auth-story-footer"><span>Furniture · Lighting · Living</span><span aria-hidden="true">↗</span></div>
      </aside>
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link className="auth-back" href="/products">← Back to the collection</Link>
        <div className="auth-panel-body">
          <span className="auth-emblem" aria-hidden="true"><i className={`bx ${mode === 'register' ? 'bx-user-plus' : mode === 'login' ? 'bx-user' : 'bx-lock-alt'}`} /></span>
          <div className="sign_intro"><span className="sign_eyebrow">{mode === 'register' ? 'YOUR NEXT CHAPTER' : mode === 'login' ? 'GOOD TO SEE YOU AGAIN' : 'YOUR ACCOUNT, PROTECTED'}</span><h1 id="auth-title">{title}</h1>{description ? <p>{description}</p> : null}</div>
          {children}
          {mode === 'recovery' ? <div className="auth-switch"><Link href="/login">← Back to sign in</Link></div> : null}
        </div>
        <p className="auth-security"><i className="bx bx-lock-alt" aria-hidden="true" /> Secure access. A place for your favourites.</p>
      </section>
    </div>
  </main>;
}
