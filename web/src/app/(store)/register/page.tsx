import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Create account', description: 'Create your JustAclick account to save favourites and manage your shopping experience.' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const back = next === '/checkout' ? '/checkout' : '';
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="global_section sign_wrapper sign_wrapper--center">
        <div className="container">
          <div className="sign_wrapper__content">
            <div className="sign_intro">
              <span className="sign_eyebrow">Join JustAclick</span>
              <h1>Create an account</h1>
            </div>
            <RegisterForm next={back} />
            <div className="sign--up">
              <p>Already registered? <Link href={back ? `/login?next=${back}` : '/login'}>Sign in</Link></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
