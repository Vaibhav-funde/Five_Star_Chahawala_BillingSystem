import React from "react";
function Contact(){
    return(
        <div>
           

{/* <!-- Contact Section --> */}
<section class="contact-section">
  <div class="contact-container">
    <h1>Contact Us</h1>

    <div class="contact-info">
      <p><strong>📍 Address:</strong> Walunj, Beed Road, Pathardi, Maharashtra, India</p>
      <p><strong>📧 Email:</strong> 5starchahawala25@gmail.com</p>
      <p><strong>📞 Phone:</strong> +91 7219349467</p>
    </div>

    <form class="contact-form" action="#" method="post">
      <label for="name">Your Name</label>
      <input type="text" id="name" name="name" placeholder="Enter your name" required/>

      <label for="email">Your Email</label>
      <input type="email" id="email" name="email" placeholder="Enter your email" required/>

      <label for="message">Your Message</label>
      <textarea id="message" name="message" rows="5" placeholder="Write your message here..." required></textarea>

      <button type="submit">Send Message</button>
    </form>
  </div>
</section>



        </div>
    )
}
export default Contact;