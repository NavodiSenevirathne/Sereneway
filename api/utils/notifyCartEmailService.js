
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with proper configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send tour info email function
export const sendTourInfoEmail = async (recipientEmail, tourInfo) => {
  const {
    tourId,
    tourTitle,
    tourDetails,
    adults,
    children,
    roomCategory,
    roomType,
    totalPrice
  } = tourInfo;

  // Email HTML content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="background-color: #4CAF50; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
        <h1 style="margin: 0; font-size: 24px;">Your Tour Package Details</h1>
      </div>
      
      <p style="color: #666;">Thank you for your interest in our tour package. Here are the details of the tour you've been interested:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #4CAF50; margin-top: 0;">${tourTitle}</h2>
        <p style="color: #666; margin-bottom: 20px;">${tourDetails ? tourDetails.substring(0, 200) + '...' : 'No description available'}</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Booking Details</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Adults:</strong> ${adults}</li>
          <li style="margin-bottom: 8px;"><strong>Children:</strong> ${children}</li>
          <li style="margin-bottom: 8px;"><strong>Room Category:</strong> ${roomCategory}</li>
          <li style="margin-bottom: 8px;"><strong>Room Type:</strong> ${roomType}</li>
          <li style="margin-bottom: 8px;"><strong>Total Price:</strong> Rs. ${totalPrice.toLocaleString()}</li>
        </ul>
      </div>
      
      <p style="color: #666;">You can complete your booking by visiting our website.</p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/user/tours/${tourId}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Tour</a>
      </div>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
        If you have any questions, please contact our customer service at ${process.env.CONTACT_EMAIL || 'support@travelexplorer.com'}.
      </p>
    </div>
  `;

  // Email options
  const mailOptions = {
    from: `"Serene Way" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Tour Information: ${tourTitle}`,
    html: htmlContent
  };

  // Send email and add error handling
  try {
    console.log('Attempting to send email to:', recipientEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
