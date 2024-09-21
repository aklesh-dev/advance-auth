import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending email", error);
        throw new Error("Error sending email", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response =await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "c0b40396-657f-4f89-9803-b9d0c734dbb0",
            template_variables: {
                company_info_name: "Authentication izumi.in",
                name: name,
            }
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error('Error sending welcome email', error);
        throw new Error('Error sending welcome email', error);        
    }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
        console.log("Reset password email sent successfully", response);
    } catch (error) {
        console.error("Error sending reset password email", error);
        throw new Error("Error sending reset password email", error);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Reset password success email sent successfully", response);
        
    } catch (error) {
        console.error("Error sending reset password success email", error);
        throw new Error("Error sending reset password success email", error);
    }      
   
};