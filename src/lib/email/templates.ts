export type EmailEvent = 
  | "SIGNUP_CONFIRMATION"
  | "VOLUNTEER_APPROVAL"
  | "VOLUNTEER_REJECTION"
  | "CONSULTATION_CONFIRMATION"
  | "CONSULTATION_REMINDER_24H"
  | "CONSULTATION_REMINDER_1H"
  | "QUESTION_ANSWERED"
  | "PASSWORD_RESET";

export interface EmailTemplatePayload {
  SIGNUP_CONFIRMATION: { name: string; email: string };
  VOLUNTEER_APPROVAL: { name: string; email: string };
  VOLUNTEER_REJECTION: { name: string; email: string; reason: string };
  CONSULTATION_CONFIRMATION: { email: string; name: string; meetingLink: string; category: string; time: string };
  CONSULTATION_REMINDER_24H: { email: string; name: string; meetingLink: string; time: string; consultationId?: string };
  CONSULTATION_REMINDER_1H: { email: string; name: string; meetingLink: string; time: string; consultationId?: string };
  QUESTION_ANSWERED: { email: string; name: string; questionTitle: string; answerLink: string };
  PASSWORD_RESET: { email: string; resetLink: string };
}

export function getEmailTemplate<T extends EmailEvent>(
  event: T,
  payload: EmailTemplatePayload[T]
): { subject: string; html: string } {
  switch (event) {
    case "SIGNUP_CONFIRMATION": {
      const p = payload as EmailTemplatePayload["SIGNUP_CONFIRMATION"];
      return {
        subject: "Welcome to The Legal Aid Clinic",
        html: `<h2>Welcome, ${p.name}!</h2><p>Your account has been created successfully.</p>`,
      };
    }
    case "VOLUNTEER_APPROVAL": {
      const p = payload as EmailTemplatePayload["VOLUNTEER_APPROVAL"];
      return {
        subject: "Your Legal Aid Clinic Application is Approved!",
        html: `<h2>Congratulations, ${p.name}!</h2><p>You have been verified and can now answer questions and take consultations.</p>`,
      };
    }
    case "VOLUNTEER_REJECTION": {
      const p = payload as EmailTemplatePayload["VOLUNTEER_REJECTION"];
      return {
        subject: "Update on your Legal Aid Clinic Application",
        html: `<h2>Hi ${p.name},</h2><p>We could not approve your application at this time. Reason: ${p.reason}</p>`,
      };
    }
    case "CONSULTATION_CONFIRMATION": {
      const p = payload as EmailTemplatePayload["CONSULTATION_CONFIRMATION"];
      return {
        subject: "Consultation Confirmed - The Legal Aid Clinic",
        html: `<h2>Your Consultation is Confirmed</h2>
               <p>Hi ${p.name}, your consultation for ${p.category} is scheduled for ${p.time}.</p>
               <p>Join using this link: <a href="${p.meetingLink}">${p.meetingLink}</a></p>`,
      };
    }
    case "CONSULTATION_REMINDER_24H": {
      const p = payload as EmailTemplatePayload["CONSULTATION_REMINDER_24H"];
      return {
        subject: "Reminder: Consultation in 24 Hours",
        html: `<h2>Consultation Reminder</h2>
               <p>Hi ${p.name}, you have a consultation tomorrow at ${p.time}.</p>
               <p>Meeting link: <a href="${p.meetingLink}">${p.meetingLink}</a></p>`,
      };
    }
    case "CONSULTATION_REMINDER_1H": {
      const p = payload as EmailTemplatePayload["CONSULTATION_REMINDER_1H"];
      return {
        subject: "Reminder: Consultation in 1 Hour",
        html: `<h2>Consultation Reminder</h2>
               <p>Hi ${p.name}, you have a consultation in 1 hour at ${p.time}.</p>
               <p>Meeting link: <a href="${p.meetingLink}">${p.meetingLink}</a></p>`,
      };
    }
    case "QUESTION_ANSWERED": {
      const p = payload as EmailTemplatePayload["QUESTION_ANSWERED"];
      return {
        subject: "Your Question has been Answered",
        html: `<h2>Your question got an answer!</h2>
               <p>Hi ${p.name}, your question "${p.questionTitle}" was answered by a verified advisor.</p>
               <p><a href="${p.answerLink}">Click here to view the answer</a></p>`,
      };
    }
    case "PASSWORD_RESET": {
      const p = payload as EmailTemplatePayload["PASSWORD_RESET"];
      return {
        subject: "Reset Your Password - The Legal Aid Clinic",
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Password Reset Request</h2>
            <p>Click the button below to reset it. This link is valid for 1 hour.</p>
            <div style="margin: 30px 0;">
              <a href="${p.resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
          </div>
        `,
      };
    }
    default:
      throw new Error(`Unknown email event: ${event}`);
  }
}
