import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logging import logger

def send_match_email(
    owner_email: str,
    owner_name: str,
    lost_item_name: str,
    found_item_name: str,
    found_location: str,
    confidence_score: float
) -> bool:
    if not settings.SMTP_ENABLED:
        logger.info(f"SMTP disabled. Skipping email notification to {owner_email} for match: '{lost_item_name}' <-> '{found_item_name}'")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Potential Match Found for your lost item: {lost_item_name}"
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg["To"] = owner_email

        body_html = f"""
        <html>
          <body>
            <h2>Good news, {owner_name}!</h2>
            <p>We found a potential match for your lost item <strong>{lost_item_name}</strong>.</p>
            <hr>
            <h3>Match Details:</h3>
            <ul>
              <li><strong>Found Item:</strong> {found_item_name}</li>
              <li><strong>Found Location:</strong> {found_location}</li>
              <li><strong>Match Confidence:</strong> {round(confidence_score * 100, 1)}%</li>
            </ul>
            <p>Please log in to the <strong>AI Lost & Found Assistant</strong> portal to review the details and contact the finder.</p>
            <p>Best regards,<br>AI Lost & Found Team</p>
          </body>
        </html>
        """

        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, owner_email, msg.as_string())

        logger.info(f"Successfully sent match notification email to {owner_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {owner_email}: {e}")
        return False
