export function ContactMain() {
  return (
    <>
<main id="main-content" tabIndex={-1}>
    <section className="contact_details">
        <div className="container">
            <div className="contact_details__content">
                <h1>Contact us</h1>
                <p>Couldn't find what you were looking for? Have a great idea for a new product? We value your feedback
                    and want to hear from you. To let us know how we can improve your shopping experience, or to ask a
                    specific question about your order, find our contact information below.</p>
                <div className="contact-table">
                    <table className="int-contact-info" summary="International Contact Information">
                        <tbody>
                            <tr>
                                <td className="int-contact-info_td">
                                    <p> United States, US Territories, and AFP/FPO</p>
                                </td>
                                <td className="int-contact-info_td">
                                    <p> 1.888.779.5176</p>
                                    <p>Fax 1.702.363.2541</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="int-contact-info_td">
                                    <p> Canada</p>
                                </td>
                                <td className="int-contact-info_td">
                                    <p> 1.855.860.1079</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="int-contact-info_td">
                                    <p> Australia</p>
                                </td>
                                <td className="int-contact-info_td">
                                    <p> 0011 800 15002222</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="int-contact-info_td">
                                    <p> All Other Countries</p>
                                </td>
                                <td className="int-contact-info_td">
                                    <p> +800.15002222</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mail-add">
                    <strong>Mailing Address</strong>
                    <p>JustAclick</p>
                    <p> 151 Union St.</p>
                    <p>San Francisco, CA 94111</p>
                </div>
            </div>
        </div>
    </section>


    </main>
    </>
  );
}
