import { ReservationRepository } from '../repositories/ReservationRepository';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Configure email transporter (use your credentials in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'test'
  }
});

export class ReservationService {
  constructor(private reservationRepository: ReservationRepository) {}

  async createReservation(userId: number, stallIds: number[], userEmail: string) {
    // Validate maximum 3 stalls per user
    const currentCount = await this.reservationRepository.countUserReservations(userId);
    if (currentCount + stallIds.length > 3) {
      throw new Error(`You can only reserve up to 3 stalls. You currently have ${currentCount} stalls reserved.`);
    }

    // Check for duplicates
    for (const stallId of stallIds) {
      const exists = await this.reservationRepository.exists(userId, stallId);
      if (exists) {
        throw new Error(`You have already reserved stall with ID ${stallId}`);
      }
    }

    const reservations = [];
   
    for (const stallId of stallIds) {
      const qrCode = uuidv4();
      const reservation = await this.reservationRepository.create(userId, stallId, qrCode);
      reservations.push(reservation);

      // Generate QR Code
      const qrData = `RESERVATION:${reservation.id}|STALL:${stallId}|USER:${userId}|CODE:${qrCode}`;
      const qrCodeImage = await QRCode.toDataURL(qrData);

      // Send email
      await this.sendConfirmationEmail(userEmail, reservation.id, qrCodeImage, stallId);
    }

    return reservations;
  }

  async getUserReservations(userId: number) {
    return await this.reservationRepository.findByUserId(userId);
  }

  async getAllReservations() {
    return await this.reservationRepository.findAll();
  }

  private async sendConfirmationEmail(toEmail: string, reservationId: number, qrCode: string, stallId: number) {
    try {
      await transporter.sendMail({
        from: '"Bookfair System" <bookfair@colombo.lk>',
        to: toEmail,
        subject: `Stall Reservation Confirmed - #${reservationId}`,
        html: `
          <h1>Stall Reservation Confirmed</h1>
          <p>Your reservation for stall ID ${stallId} has been confirmed.</p>
          <p>Reservation ID: ${reservationId}</p>
          <p>Please present this QR code at the event:</p>
          <img src="${qrCode}" alt="QR Code" />
          <p>Thank you for choosing Colombo International Bookfair!</p>
        `
      });
      console.log(`Confirmation email sent for reservation ${reservationId}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}