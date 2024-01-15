import nodemailer from "nodemailer";
import { config } from "../config/config.js";

class emailService{
    constructor(){
      this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: config.GMAIL_USER,
                pass: config.GMAIL_PASS
            }
        })
    }

    sendEmail(to, subject, html, attachments = []){
        return this.transporter.sendMail({
            from: config.GMAIL_USER,
            to,
            subject,
            html,
            attachments
        })
    }
}

export default new emailService();