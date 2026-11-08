const year = new Date().getFullYear();

const customerService = {
  id: 'footer-customer-service',
  title: 'Customer Service',
  links: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'My Account', href: '/account/profile' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Return Policies', href: '/returns' },
    { label: 'Shipping Information', href: '/shipping' },
    { label: 'Chat Support', href: '/chat-support' },
    { label: 'Brand Feedback', href: '/brand-feedback' },
    { label: 'Safety Recalls', href: '/safety-recalls' }
  ]
} as const;

const resources = {
  id: 'footer-resources',
  title: 'Resources',
  links: [
    { label: 'Gift Registry', href: '/gift-registry' },
    { label: 'Online Catalogue', href: '/products' }
  ]
} as const;

const ourCompany = {
  id: 'footer-our-company',
  title: 'Our Company',
  links: [
    { label: 'Our Story', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Sustainability', href: '/sustainability' }
  ]
} as const;

const b2b = {
  id: 'footer-b2b',
  title: 'B2B Opportunities',
  links: [
    { label: 'B2B Overview', href: '/b2b' },
    { label: 'Corporate Gifting', href: '/corporate-gifting' },
    { label: 'Event Planners', href: '/event-planners' },
    { label: 'Hotels & Restaurant Chains', href: '/hotels-restaurants' },
    { label: 'Hospitality Solutions', href: '/hospitality' }
  ]
} as const;

const interiorDesign = {
  id: 'footer-interior-design',
  title: 'Interior Design',
  links: [
    { label: 'Interior Design Services', href: '/interior-design' },
    { label: 'Design Consultation', href: '/design-consultation' },
    { label: 'Personalized Design Solutions', href: '/personalized-design' }
  ]
} as const;

const payments = ['Visa', 'Mastercard', 'RuPay', 'UPI', 'Net Banking'] as const;

function FooterSection({
  id,
  title,
  links
}: {
  id: string;
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="footer-section">
      <h6 data-footer-toggle={id}>{title}</h6>
      <div className="footer_links" id={id}>
        {links.map((link) => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer_wrapper">
        <div className="container">
          <div className="footer-main">
            <div className="footer_wrapper__box">
              <FooterSection {...customerService} />
            </div>

            <div className="footer_wrapper__box footer-stack">
              <FooterSection {...resources} />
              <FooterSection {...b2b} />
            </div>

            <div className="footer_wrapper__box footer-stack">
              <FooterSection {...ourCompany} />
              <div className="footer-section footer-section--payments">
                <h6>We Accept</h6>
                <ul className="footer-payments" aria-label="Accepted payment methods">
                  {payments.map((method) => (
                    <li key={method}><span>{method}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer_wrapper__box">
              <FooterSection {...interiorDesign} />
            </div>

            <div className="footer_wrapper__box footer_email">
              <h6 className="footer-signup-title">Sign Up For Sale, New Arrivals &amp; More</h6>
              <form className="newsletter-form" data-static-form="Email signup is currently unavailable. Please try again later.">
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Enter your email address*" required />
                <label className="sr-only" htmlFor="newsletter-phone">Mobile number</label>
                <input id="newsletter-phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your mobile number (Optional)" />
                <p className="footer-signup-note">
                  By signing up you agree to receive marketing emails and texts from Rare Objet. You can unsubscribe at any time. View our{' '}
                  <a href="/terms">Terms &amp; Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.
                </p>
                <button type="submit">Sign Up Now</button>
              </form>
              <div className="footer-locale">
                <label>
                  <span className="sr-only">Country</span>
                  <select name="country" defaultValue="IN" aria-label="Country">
                    <option value="IN">India</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Currency</span>
                  <select name="currency" defaultValue="INR" aria-label="Currency">
                    <option value="INR">INR ₹</option>
                    <option value="AED">AED د.إ</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom__inner">
            <div className="footer-bottom__legal">
              <p>© All Rights Reserved, {year} Rare Objet.</p>
              <div className="footer-bottom__links">
                <a href="/terms">Terms &amp; Conditions</a>
                <a href="/cookie-policy">Cookie Policy</a>
                <a href="/privacy-policy">Privacy Policy</a>
              </div>
            </div>
            <div className="footer-bottom__actions">
              <div className="follow_links">
                <a href="#" aria-label="Instagram"><i className="bx bxl-instagram" aria-hidden="true" /></a>
                <a href="#" aria-label="Facebook"><i className="bx bxl-facebook" aria-hidden="true" /></a>
                <a href="#" aria-label="Pinterest"><i className="bx bxl-pinterest" aria-hidden="true" /></a>
                <a href="#" aria-label="YouTube"><i className="bx bxl-youtube" aria-hidden="true" /></a>
              </div>
              <a className="footer-back-top" href="#main-content" aria-label="Back to top">
                <i className="bx bx-chevron-up" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
