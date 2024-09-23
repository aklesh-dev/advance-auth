import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    // Validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    console.log("Validating email:", email);
    
    if (!isValidEmail(email)) {
        throw new Error("Invalid email address.");
    }

    const recipient = [{ email }];
    const MAX_RETRIES = 3;
    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
        attempts++;

        try {
            const response = await mailtrapClient.send({
                from: sender,
                to: recipient,
                subject: "Verify your email",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "Email Verification",

            });
            console.log("Email sent successfully", response);
            success = true; // Exit loop if email is sent successfully
        } catch (error) {
            console.error(`Error sending email ${attempts}:`, error.message);
            if (attempts >= MAX_RETRIES) {
                throw new Error("Failed to send email after multiple attempts.");
            }
            // Wait for 2 second before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
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
    const recipient = [{ email }];

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