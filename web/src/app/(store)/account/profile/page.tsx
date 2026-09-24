import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="global_section sign_wrapper">
        <div className="container">
          <div className="sign_wrapper__content">
            <h1>Profile</h1>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.phone || 'No phone on file'}</p>
            <p>Delivery details are collected at checkout. Password reset is not part of the current store.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
