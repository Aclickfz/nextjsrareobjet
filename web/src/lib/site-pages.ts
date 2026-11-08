export type SitePageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'cards'; items: { title: string; text: string }[] };

export type SitePage = {
  slug: string;
  title: string;
  description: string;
  eyebrow?: string;
  image: string;
  imageAlt: string;
  intro: string;
  blocks: SitePageBlock[];
  cta?: { label: string; href: string };
};

export const sitePages: SitePage[] = [
  {
    slug: 'returns',
    title: 'Return Policies',
    description: 'How returns and exchanges work at Rare Objet.',
    eyebrow: 'Customer Service',
    image: '/assets/images/sofa1.webp',
    imageAlt: 'Living room furniture from Rare Objet',
    intro: 'We want every piece to feel right in your home. If something is not the perfect fit, our returns team will help you exchange or return eligible items with clear timelines and support.',
    blocks: [
      { type: 'paragraph', text: 'Most unused items in original packaging may be returned within 7 days of delivery. Custom, made-to-order, clearance, and intimate personal-care goods are not eligible unless they arrive damaged or incorrect.' },
      { type: 'list', items: [
        'Start a return from My Account or Contact Us with your order number.',
        'Keep all packaging, hardware, and care cards until the return is approved.',
        'Refunds are issued to the original payment method after inspection.',
        'White Glove pickup can be arranged for large furniture where available.'
      ] },
      { type: 'paragraph', text: 'Damaged, defective, or incorrect items are covered by our quality promise. Share clear photos within 48 hours of delivery so we can arrange a replacement or pickup quickly.' }
    ],
    cta: { label: 'Start a return request', href: '/contact' }
  },
  {
    slug: 'shipping',
    title: 'Shipping Information',
    description: 'Delivery timelines, shipping options, and tracking for Rare Objet orders.',
    eyebrow: 'Customer Service',
    image: '/assets/images/furniture2.jpeg',
    imageAlt: 'Furniture ready for delivery',
    intro: 'From compact décor to full living-room sets, we ship across India with tracked delivery and optional White Glove placement on selected furniture.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Standard delivery', text: 'Most in-stock décor and lighting ships within 2–4 business days.' },
        { title: 'Furniture delivery', text: 'Larger pieces typically arrive in 5–10 business days, depending on destination.' },
        { title: 'White Glove', text: 'Available on eligible furniture with room-of-choice placement and packaging removal.' }
      ] },
      { type: 'list', items: [
        'A flat shipping rate may apply at checkout unless Free Shipping is shown on the product.',
        'You will receive tracking updates once the carrier scans your parcel.',
        'Remote pin codes may need extra transit time.',
        'Someone 18+ should be available to receive large deliveries.'
      ] }
    ],
    cta: { label: 'Track an order', href: '/track-order' }
  },
  {
    slug: 'chat-support',
    title: 'Chat Support',
    description: 'Talk with a Rare Objet design and order specialist.',
    eyebrow: 'Customer Service',
    image: '/assets/images/decoration.webp',
    imageAlt: 'Styled home décor details',
    intro: 'Need help choosing a finish, checking stock, or updating an order? Our specialists are ready to guide you through sizing, materials, and delivery.',
    blocks: [
      { type: 'paragraph', text: 'Chat support is available for product advice, order status, returns guidance, and design questions. For account-secured changes we may ask for your registered email and order number.' },
      { type: 'list', items: [
        'Typical response window: within a few minutes during business hours.',
        'Share room photos or dimensions for faster furniture recommendations.',
        'After-hours messages are answered on the next business day.'
      ] }
    ],
    cta: { label: 'Open chat', href: '/chat-support' }
  },
  {
    slug: 'brand-feedback',
    title: 'Brand Feedback',
    description: 'Share ideas that help Rare Objet improve your shopping experience.',
    eyebrow: 'Customer Service',
    image: '/assets/images/collection1.avif',
    imageAlt: 'Rare Objet collection vignette',
    intro: 'Your notes shape how we design, package, and deliver. Tell us what delighted you, what felt missing, and which collections you want to see next.',
    blocks: [
      { type: 'paragraph', text: 'We review feedback on product quality, website experience, packaging, delivery partners, and in-home design services. Constructive detail helps us improve faster for every customer.' },
      { type: 'list', items: [
        'Include your order number when feedback relates to a purchase.',
        'Product ideas and material requests are welcome.',
        'We cannot reply to every note personally, but every submission is read.'
      ] }
    ],
    cta: { label: 'Send feedback', href: '/brand-feedback' }
  },
  {
    slug: 'safety-recalls',
    title: 'Safety Recalls',
    description: 'Product safety notices and recall information from Rare Objet.',
    eyebrow: 'Customer Service',
    image: '/assets/images/img2.jpeg',
    imageAlt: 'Home furnishings detail',
    intro: 'Product safety comes first. If a recall is issued, we publish clear instructions here and notify affected customers by email whenever contact details are available.',
    blocks: [
      { type: 'paragraph', text: 'There are currently no active safety recalls for Rare Objet products. Check this page periodically, or contact us if you believe an item may be affected by a supplier notice.' },
      { type: 'list', items: [
        'Keep your account email current so we can reach you quickly.',
        'Stop using a recalled product immediately and follow the posted steps.',
        'Save your invoice or order confirmation for faster verification.'
      ] }
    ],
    cta: { label: 'Ask about a product', href: '/contact' }
  },
  {
    slug: 'gift-registry',
    title: 'Gift Registry',
    description: 'Create a Rare Objet gift registry for weddings, new homes, and celebrations.',
    eyebrow: 'Resources',
    image: '/assets/images/gift1.jpg',
    imageAlt: 'Curated gift styling',
    intro: 'Build a registry of furniture, lighting, tabletop, and décor pieces your guests can shop with confidence—perfect for weddings, housewarmings, and festive gifting.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Create', text: 'Sign in and add favorites from Furniture, Home Décor, Lighting, and Gifts.' },
        { title: 'Share', text: 'Send your registry link to family and friends with preferred finishes already selected.' },
        { title: 'Update', text: 'Edit quantities, mark purchased pieces, and keep thank-you notes organized.' }
      ] },
      { type: 'paragraph', text: 'Our team can also help curate a registry around your room plan, color story, or budget. Start with favorites, then request a design consultation for finishing touches.' }
    ],
    cta: { label: 'Browse gifts', href: '/categories/gifts' }
  },
  {
    slug: 'careers',
    title: 'Careers',
    description: 'Join the Rare Objet team across design, retail, and operations.',
    eyebrow: 'Our Company',
    image: '/assets/images/furniture.jpeg',
    imageAlt: 'Rare Objet interiors inspiration',
    intro: 'We are building a modern home brand rooted in craftsmanship, considered design, and thoughtful service. If that sounds like your kind of work, we would love to hear from you.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Design & merchandising', text: 'Shape collections across furniture, lighting, and décor.' },
        { title: 'Customer experience', text: 'Help clients choose pieces and manage orders with care.' },
        { title: 'Operations & studio', text: 'Keep photography, fulfillment, and quality standards sharp.' }
      ] },
      { type: 'paragraph', text: 'Open roles are shared by email. Send your résumé, portfolio link, and a short note about the team you want to join.' }
    ],
    cta: { label: 'Share your profile', href: '/contact' }
  },
  {
    slug: 'sustainability',
    title: 'Sustainability',
    description: 'How Rare Objet approaches materials, packaging, and lasting design.',
    eyebrow: 'Our Company',
    image: '/assets/images/collection2.avif',
    imageAlt: 'Natural textures and lasting materials',
    intro: 'Beautiful rooms should last. We prioritize durable materials, responsible packaging, and designs you will keep through many seasons—not disposable trends.',
    blocks: [
      { type: 'list', items: [
        'Favor long-wearing woods, metals, textiles, and finishes.',
        'Reduce excess packaging wherever shipping protection allows.',
        'Support repair, replacement parts, and informed care guidance.',
        'Choose suppliers who meet our quality and compliance expectations.'
      ] },
      { type: 'paragraph', text: 'Sustainability is ongoing work. As collections grow, we continue refining materials, logistics, and product care resources for customers.' }
    ],
    cta: { label: 'Explore the collection', href: '/products' }
  },
  {
    slug: 'b2b',
    title: 'B2B Overview',
    description: 'Trade and business programs for designers, hotels, and corporate clients.',
    eyebrow: 'B2B Opportunities',
    image: '/assets/images/sofa4.webp',
    imageAlt: 'Furnished commercial living space',
    intro: 'Rare Objet partners with interior designers, hospitality groups, event planners, and corporate teams who need reliable sourcing, volume support, and cohesive styling.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Trade pricing', text: 'Access project-friendly pricing for qualifying professionals.' },
        { title: 'Dedicated support', text: 'Work with a specialist on timelines, finishes, and delivery windows.' },
        { title: 'Project continuity', text: 'Keep rooms consistent across suites, lobbies, and residences.' }
      ] },
      { type: 'paragraph', text: 'Tell us about your project size, installation dates, and preferred categories. We will recommend a program path—corporate gifting, hospitality, or design trade.' }
    ],
    cta: { label: 'Talk to B2B', href: '/contact' }
  },
  {
    slug: 'corporate-gifting',
    title: 'Corporate Gifting',
    description: 'Curated Rare Objet gifts for clients, teams, and celebrations.',
    eyebrow: 'B2B Opportunities',
    image: '/assets/images/mygift1.webp',
    imageAlt: 'Styled gift presentation',
    intro: 'Send memorable gifts that feel personal and polished—tabletop accents, lighting, décor objects, and seasonal sets ready for branding or bulk fulfillment.',
    blocks: [
      { type: 'list', items: [
        'Curated sets for festivals, onboarding, and client appreciation.',
        'Volume quotes with coordinated packaging notes.',
        'Support for multi-address shipping lists when available.'
      ] },
      { type: 'paragraph', text: 'Share your budget range, quantity, and delivery deadline. Our team will propose options from Gifts, Home Décor, and Kitchen & Tabletop.' }
    ],
    cta: { label: 'Plan corporate gifts', href: '/contact' }
  },
  {
    slug: 'event-planners',
    title: 'Event Planners',
    description: 'Furniture and décor sourcing for events, activations, and styled sets.',
    eyebrow: 'B2B Opportunities',
    image: '/assets/images/holday1.png',
    imageAlt: 'Event-ready tablescape styling',
    intro: 'From intimate dinners to large seasonal installations, we help planners source statement pieces, tabletop layers, and lighting that photograph beautifully and install cleanly.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Lookbook pulls', text: 'Build mood boards from current Rare Objet collections.' },
        { title: 'Timeline planning', text: 'Align delivery with setup windows and venue access.' },
        { title: 'Repeat programs', text: 'Keep brand events consistent across cities and seasons.' }
      ] }
    ],
    cta: { label: 'Brief your event', href: '/contact' }
  },
  {
    slug: 'hotels-restaurants',
    title: 'Hotels & Restaurant Chains',
    description: 'Furnishing programs for hospitality rooms, lounges, and dining spaces.',
    eyebrow: 'B2B Opportunities',
    image: '/assets/images/sofa5.webp',
    imageAlt: 'Lounge seating for hospitality spaces',
    intro: 'Outfit guest rooms, lobbies, restaurants, and suites with cohesive furniture, lighting, and décor that balances durability with atmosphere.',
    blocks: [
      { type: 'list', items: [
        'Spec support for multi-property rollouts.',
        'Guidance on finishes suited to high-traffic spaces.',
        'Coordinated delivery planning by wing, floor, or opening date.'
      ] },
      { type: 'paragraph', text: 'Share floor plans or room counts and we will map a phased purchasing plan across Furniture, Lighting & Lamps, and Home Décor.' }
    ],
    cta: { label: 'Discuss hospitality needs', href: '/contact' }
  },
  {
    slug: 'hospitality',
    title: 'Hospitality Solutions',
    description: 'End-to-end hospitality furnishing and styling support from Rare Objet.',
    eyebrow: 'B2B Opportunities',
    image: '/assets/images/furniture4.jpeg',
    imageAlt: 'Hospitality interior inspiration',
    intro: 'Hospitality projects need more than beautiful products—they need dependable lead times, clear specifications, and rooms that feel intentional from check-in to checkout.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Room packages', text: 'Bundle seating, lighting, and accents for standard room types.' },
        { title: 'Public spaces', text: 'Style lobbies, lounges, and dining areas with cohesive collections.' },
        { title: 'Ongoing refresh', text: 'Plan seasonal updates without redesigning every floor.' }
      ] }
    ],
    cta: { label: 'Request a hospitality consult', href: '/contact' }
  },
  {
    slug: 'interior-design',
    title: 'Interior Design Services',
    description: 'Rare Objet interior design services for homes and projects.',
    eyebrow: 'Interior Design',
    image: '/assets/images/banner.jpg',
    imageAlt: 'Designed living space',
    intro: 'Work with our design team to shape rooms that feel collected, calm, and personal—using Rare Objet furniture, lighting, and décor as the foundation.',
    blocks: [
      { type: 'list', items: [
        'Room-by-room planning for living, dining, bedroom, and entry spaces.',
        'Finish and fabric guidance matched to your light and lifestyle.',
        'Product schedules you can purchase directly from our shop.'
      ] },
      { type: 'paragraph', text: 'Whether you are furnishing a new home or refreshing one key room, we start with how you live, then build a clear shopping plan.' }
    ],
    cta: { label: 'Book design services', href: '/contact' }
  },
  {
    slug: 'design-consultation',
    title: 'Design Consultation',
    description: 'Book a focused Rare Objet design consultation for your space.',
    eyebrow: 'Interior Design',
    image: '/assets/images/sofa2.webp',
    imageAlt: 'Seating and styling consultation mood',
    intro: 'A design consultation is the fastest way to get expert eyes on your room plan, measurements, and shortlist before you buy.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Prepare', text: 'Share photos, dimensions, and inspiration links ahead of the call.' },
        { title: 'Review', text: 'Walk through layout, scale, and material choices with a specialist.' },
        { title: 'Shop', text: 'Leave with a focused product list from current collections.' }
      ] }
    ],
    cta: { label: 'Request a consultation', href: '/contact' }
  },
  {
    slug: 'personalized-design',
    title: 'Personalized Design Solutions',
    description: 'Custom room concepts tailored to your home with Rare Objet.',
    eyebrow: 'Interior Design',
    image: '/assets/images/furniture5.jpeg',
    imageAlt: 'Personalized room styling',
    intro: 'For clients who want a deeper collaboration, we build personalized room concepts that balance architecture, storage needs, and the pieces you already love.',
    blocks: [
      { type: 'paragraph', text: 'Personalized solutions can include furniture plans, lighting layers, décor editing, and phased purchasing so your home comes together without unnecessary overwhelm.' },
      { type: 'list', items: [
        'Ideal for full-home moves, renovations, and multi-room refreshes.',
        'Works alongside architects, contractors, and property managers.',
        'Recommendations stay shoppable through Rare Objet categories.'
      ] }
    ],
    cta: { label: 'Start a personalized plan', href: '/contact' }
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'How Rare Objet collects, uses, and protects your information.',
    eyebrow: 'Legal',
    image: '/assets/images/img3.jpeg',
    imageAlt: 'Quiet home interior',
    intro: 'This policy explains what information we collect when you browse, create an account, place an order, or contact Rare Objet, and how that information is used.',
    blocks: [
      { type: 'list', items: [
        'Account details such as name, email, phone, and delivery addresses.',
        'Order and payment metadata needed to fulfill purchases.',
        'Site usage data that helps us improve performance and content.',
        'Messages you send through contact, chat, or feedback forms.'
      ] },
      { type: 'paragraph', text: 'We do not sell personal information. Data is shared only with service partners required to operate payments, delivery, hosting, and customer support, subject to appropriate safeguards.' },
      { type: 'paragraph', text: 'You may request access or correction of your account information by contacting us. Some records are retained as required for legal, tax, or fraud-prevention purposes.' }
    ],
    cta: { label: 'Contact privacy support', href: '/contact' }
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    description: 'Terms that govern shopping and using the Rare Objet website.',
    eyebrow: 'Legal',
    image: '/assets/images/img4.jpeg',
    imageAlt: 'Product styling detail',
    intro: 'By using Rare Objet websites and services, you agree to these terms covering accounts, orders, pricing, shipping, returns, and acceptable use.',
    blocks: [
      { type: 'list', items: [
        'Product images are representative; natural materials may vary slightly.',
        'Prices and promotions can change until an order is confirmed.',
        'You are responsible for providing accurate delivery information.',
        'Misuse of the site, fraud, or abuse of promotions may lead to account limits.'
      ] },
      { type: 'paragraph', text: 'Orders are subject to availability and verification. If we cannot fulfill an item, we will notify you and arrange a refund or suitable alternative where possible.' }
    ],
    cta: { label: 'Shop the collection', href: '/products' }
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    description: 'How Rare Objet uses cookies and similar technologies.',
    eyebrow: 'Legal',
    image: '/assets/images/img5.jpeg',
    imageAlt: 'Minimal interior detail',
    intro: 'Cookies help the site remember preferences, keep you signed in, measure performance, and improve shopping features such as cart and recently viewed items.',
    blocks: [
      { type: 'cards', items: [
        { title: 'Essential', text: 'Required for security, login sessions, and checkout.' },
        { title: 'Preferences', text: 'Remember settings like currency display where available.' },
        { title: 'Analytics', text: 'Help us understand which pages and products are most useful.' }
      ] },
      { type: 'paragraph', text: 'You can control cookies through your browser settings. Disabling essential cookies may limit account, cart, or checkout functionality.' }
    ],
    cta: { label: 'Read our privacy policy', href: '/privacy-policy' }
  }
];

export function getSitePage(slug: string) {
  return sitePages.find((page) => page.slug === slug) || null;
}
