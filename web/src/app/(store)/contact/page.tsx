import type { Metadata } from 'next';
import { ContactMain } from '@/components/pages/ContactMain';
export const metadata: Metadata = { title: 'Contact us', description: 'Contact Rare Objet.' };
export default function ContactPage() { return <ContactMain />; }
