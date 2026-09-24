import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Sign in', description: 'Sign in to your JustAclick account.' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const back = next === '/checkout' ? '/checkout' : '';
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="global_section sign_wrapper sign_wrapper--center">
        <div className="container">
          <div className="sign_wrapper__content">
            <div className="sign_intro">
              <span className="sign_eyebrow">Welcome back</span>
              <h1>Sign in to your account</h1>
              <p>Enter your details to continue shopping with JustAclick.</p>
            </div>
            <LoginForm next={back} />
            <div className="sign--up">
              <p>Don&apos;t have an account yet? <Link href={back ? `/register?next=${back}` : '/register'}>Create an account</Link></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
