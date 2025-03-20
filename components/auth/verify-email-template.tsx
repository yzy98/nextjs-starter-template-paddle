import { User } from "better-auth";
import * as React from "react";

interface VerifyEmailTemplateProps {
  user: User;
  url?: string;
}

export const VerifyEmailTemplate = ({
  user,
  url,
}: VerifyEmailTemplateProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>
          Verify Your Email Address
        </h1>
      </div>
      <div style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
        <p>Hello {user.name || user.email},</p>
        <p>
          Thank you for signing up. Please verify your email address to complete
          your registration.
        </p>
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={url}
            style={{
              backgroundColor: "#0070f3",
              color: "white",
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Verify Email Address
          </a>
        </div>
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
      <div
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "20px",
          marginTop: "20px",
          fontSize: "14px",
          color: "#777",
          textAlign: "center",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} NextJS Starter Template. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};
