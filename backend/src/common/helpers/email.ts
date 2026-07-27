import ejs from 'ejs';
import path from 'path';
import { resend } from '@/config/email';
import { config } from '@/config/app';

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export const sendEmail = async ({ to, subject, template, data }: SendEmailOptions) => {
  const templatePath = path.join(__dirname, `../../modules/auth/templates/${template}.ejs`);
  const html = await ejs.renderFile(templatePath, data);

  await resend.emails.send({
    from: config.email.from,
    to,
    subject,
    html,
  });
};
