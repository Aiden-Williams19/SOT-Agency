import React from 'react'
import { format } from 'date-fns'
import './BookingConfirmation.css'

function BookingConfirmation({ bookingData, onClose, onNewBooking }) {
  const { booking, confirmationCode, clientInfo, selectedDate, selectedSlot } = bookingData

  const handleEmailConfirmation = () => {
    const subject = `Appointment Confirmation - ${confirmationCode}`
    const body = `Hi ${clientInfo.name},

Thank you for booking an appointment with SOT Agency!

APPOINTMENT DETAILS:
📅 Date: ${format(selectedDate, 'EEEE, MMMM do, yyyy')}
⏰ Time: ${format(selectedSlot.start, 'h:mm a')} - ${format(selectedSlot.end, 'h:mm a')}
🎯 Service: ${clientInfo.service || 'Consultation'}
🔢 Confirmation Code: ${confirmationCode}

${clientInfo.message ? `📝 Additional Notes: ${clientInfo.message}` : ''}

NEXT STEPS:
1. Add this appointment to your calendar using the "Add to Calendar" button
2. We'll send you a reminder 24 hours before your appointment
3. If you need to reschedule, please contact us at least 24 hours in advance

CONTACT INFO:
📧 Email: aidenwilliams336@gmail.com
📞 Phone: 0672089491

We're looking forward to meeting with you!

Best regards,
SOT Agency Team`

    const mailtoLink = `mailto:${clientInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  const handleAddToCalendar = () => {
    // Create ICS file content for calendar import
    const startDate = selectedSlot.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDate = selectedSlot.end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SOT Agency//Booking System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${confirmationCode}@sotagency.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Meeting with SOT Agency - ${clientInfo.service || 'Consultation'}
DESCRIPTION:Appointment with SOT Agency\\n\\nService: ${clientInfo.service || 'Consultation'}\\nConfirmation Code: ${confirmationCode}\\n\\n${clientInfo.message ? `Notes: ${clientInfo.message}\\n\\n` : ''}Contact: aidenwilliams336@gmail.com | 0672089491
LOCATION:Online/Phone
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Meeting with SOT Agency tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `SOT-Agency-Appointment-${confirmationCode}.ics`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Show success message
    alert('Calendar event downloaded! You can now import it into your calendar app.')
  }

  return (
    <div className="booking-confirmation-overlay">
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h2>Appointment Booked Successfully!</h2>
          <p className="confirmation-code">Confirmation Code: {confirmationCode}</p>
        </div>

        <div className="confirmation-details">
          <h3>Appointment Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{format(selectedSlot.start, 'h:mm a')} - {format(selectedSlot.end, 'h:mm a')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{clientInfo.service || 'Consultation'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Client:</span>
              <span className="detail-value">{clientInfo.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{clientInfo.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{clientInfo.phone}</span>
            </div>
          </div>
          
          {clientInfo.message && (
            <div className="detail-item full-width">
              <span className="detail-label">Additional Notes:</span>
              <span className="detail-value">{clientInfo.message}</span>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <h4>Next Steps</h4>
          <div className="action-buttons">
            <button onClick={handleEmailConfirmation} className="action-btn email-btn">
              📧 Send Email Confirmation
            </button>
            <button onClick={handleAddToCalendar} className="action-btn calendar-btn">
              📅 Add to Calendar
            </button>
          </div>
        </div>

        <div className="confirmation-footer">
          <p className="reminder">
            We'll send you a calendar invite shortly. If you need to reschedule or have any questions, 
            please contact us at <a href="mailto:aidenwilliams336@gmail.com">aidenwilliams336@gmail.com</a> 
            or call <a href="tel:0672089491">0672089491</a>.
          </p>
          
          <div className="footer-actions">
            <button onClick={onNewBooking} className="btn secondary">
              Book Another Appointment
            </button>
            <button onClick={onClose} className="btn primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
