"""Email notifications via SendGrid — optional.

If SENDGRID_API_KEY, SENDGRID_FROM_EMAIL and BOOKING_NOTIFICATION_EMAIL are
all set, every new booking and contact-form submission triggers an email to
the shop owner. Otherwise, the email step is skipped silently and the
underlying API still succeeds — bookings/contacts are always saved to Mongo.

Set the values in `backend/.env`:

    SENDGRID_API_KEY=SG....
    SENDGRID_FROM_EMAIL=hello@your-domain.com   # must be a Verified Sender in SendGrid
    BOOKING_NOTIFICATION_EMAIL=owner@your-domain.com

Get the API key from:
    https://app.sendgrid.com/settings/api_keys (Full Access or Mail Send)

Verify the FROM address (Single Sender Verification) in:
    https://app.sendgrid.com/settings/sender_auth/senders
"""

from __future__ import annotations

import logging
import os
from typing import Any, Dict, Optional

logger = logging.getLogger("notifications")


def is_configured() -> bool:
    return bool(
        (os.environ.get("SENDGRID_API_KEY", "").strip())
        and (os.environ.get("SENDGRID_FROM_EMAIL", "").strip())
        and (os.environ.get("BOOKING_NOTIFICATION_EMAIL", "").strip())
    )


def _to() -> str:
    return os.environ.get("BOOKING_NOTIFICATION_EMAIL", "").strip()


def _from() -> str:
    return os.environ.get("SENDGRID_FROM_EMAIL", "").strip()


def _send(subject: str, html: str, text: str, reply_to: Optional[str] = None) -> bool:
    if not is_configured():
        logger.info("Email skipped (SendGrid not configured): %s", subject)
        return False

    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail, ReplyTo
    except ImportError:
        logger.error("sendgrid package not installed. `pip install sendgrid`.")
        return False

    msg = Mail(
        from_email=_from(),
        to_emails=_to(),
        subject=subject,
        plain_text_content=text,
        html_content=html,
    )
    if reply_to:
        msg.reply_to = ReplyTo(reply_to)

    try:
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"].strip())
        resp = sg.send(msg)
        ok = resp.status_code in (200, 202)
        if not ok:
            logger.warning("SendGrid status %s: %s", resp.status_code, resp.body)
        return ok
    except Exception as e:
        logger.error("SendGrid send failed: %s", e)
        return False


def _row(label: str, value: Any) -> str:
    return (
        f'<tr><td style="padding:6px 0;color:#888;width:120px">{label}</td>'
        f'<td style="padding:6px 0">{value or "-"}</td></tr>'
    )


def send_booking_notification(booking: Dict[str, Any]) -> bool:
    subject = f"🔧 Nowe zgłoszenie naprawy: {booking.get('service', '-')}"

    text = f"""Nowe zgłoszenie naprawy

Imię:       {booking.get('name')}
E-mail:     {booking.get('email')}
Telefon:    {booking.get('phone')}
Usługa:     {booking.get('service')}
Urządzenie: {booking.get('device')}
Data:       {booking.get('preferred_date') or '-'}

Opis problemu:
{booking.get('issue')}

ID:         {booking.get('id')}
Otrzymane:  {booking.get('created_at')}
"""

    html = (
        '<!doctype html><html><body style="font-family:system-ui,Segoe UI,Arial,sans-serif;'
        'background:#0d0d14;color:#fff;padding:24px;margin:0">'
        '<div style="max-width:560px;margin:0 auto;background:#13131c;'
        'border:1px solid #2a2a3a;border-radius:12px;padding:24px">'
        '<h2 style="margin:0 0 16px;color:#00e5ff;font-weight:800">Nowe zgłoszenie naprawy</h2>'
        '<table style="width:100%;border-collapse:collapse">'
        + _row("Imię", booking.get("name"))
        + _row(
            "E-mail",
            f'<a style="color:#00e5ff" href="mailto:{booking.get("email")}">{booking.get("email")}</a>',
        )
        + _row(
            "Telefon",
            f'<a style="color:#00e5ff" href="tel:{booking.get("phone")}">{booking.get("phone")}</a>',
        )
        + _row("Usługa", booking.get("service"))
        + _row("Urządzenie", booking.get("device"))
        + _row("Data", booking.get("preferred_date"))
        + "</table>"
        '<h3 style="margin:18px 0 8px;color:#b829ff">Opis problemu</h3>'
        '<p style="background:#0a0a12;padding:12px;border-radius:8px;'
        'border-left:3px solid #b829ff;white-space:pre-wrap">'
        f'{booking.get("issue")}</p>'
        f'<p style="color:#666;font-size:12px;margin-top:24px">'
        f'ID: {booking.get("id")} · {booking.get("created_at")}</p>'
        "</div></body></html>"
    )

    return _send(subject, html, text, reply_to=booking.get("email"))


def send_contact_notification(contact: Dict[str, Any]) -> bool:
    subject = f"📩 Nowa wiadomość: {contact.get('subject') or 'bez tematu'}"

    text = f"""Nowa wiadomość z formularza kontaktowego

Od:    {contact.get('name')} <{contact.get('email')}>
Temat: {contact.get('subject') or '-'}

{contact.get('message')}

ID:    {contact.get('id')}
Czas:  {contact.get('created_at')}
"""

    html = (
        '<!doctype html><html><body style="font-family:system-ui,Segoe UI,Arial,sans-serif;'
        'background:#0d0d14;color:#fff;padding:24px;margin:0">'
        '<div style="max-width:560px;margin:0 auto;background:#13131c;'
        'border:1px solid #2a2a3a;border-radius:12px;padding:24px">'
        '<h2 style="margin:0 0 16px;color:#b829ff;font-weight:800">Nowa wiadomość kontaktowa</h2>'
        f'<p style="margin:8px 0">Od: <b>{contact.get("name")}</b> '
        f'&lt;<a style="color:#00e5ff" href="mailto:{contact.get("email")}">'
        f'{contact.get("email")}</a>&gt;</p>'
        f'<p style="margin:8px 0">Temat: <b>{contact.get("subject") or "-"}</b></p>'
        '<div style="background:#0a0a12;padding:12px;border-radius:8px;'
        'border-left:3px solid #00e5ff;white-space:pre-wrap">'
        f'{contact.get("message")}</div>'
        f'<p style="color:#666;font-size:12px;margin-top:24px">'
        f'ID: {contact.get("id")} · {contact.get("created_at")}</p>'
        "</div></body></html>"
    )

    return _send(subject, html, text, reply_to=contact.get("email"))
