// Modern booking page with integrated calendar and smart availability
import { useState } from 'react'
import SimpleCalendar from '../components/SimpleCalendar'
import BookingForm from '../components/BookingForm'
import BookingConfirmation from '../components/BookingConfirmation'
import './pages.css'

function Booking() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDateSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start)
    setShowBookingForm(true)
  }

  const handleBookingSuccess = (data) => {
    setBookingData(data)
    setShowConfirmation(true)
    setShowBookingForm(false)
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setBookingData(null)
    setSelectedDate(null)
  }

  const handleNewBooking = () => {
    setShowConfirmation(false)
    setBookingData(null)
    setSelectedDate(null)
    setShowBookingForm(false)
  }

  const handleCloseForm = () => {
    setShowBookingForm(false)
    setSelectedDate(null)
  }

  return (
    <div className="page">
      <div className="booking-header">
        <h2>Book a Meeting</h2>
        <p className="muted">
          We're available Monday to Friday, 9 AM - 5 PM. Select a date from the calendar below to see available time slots. 
          You'll get instant confirmation and calendar invites. 
          Prefer a quick call? <a href="tel:0672089491">0672089491</a>
        </p>
      </div>

      <div className="booking-content">
        <div className="booking-calendar">
          <SimpleCalendar 
            onSelectSlot={handleDateSelect}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {showBookingForm && (
          <div className="booking-form-section">
            <BookingForm
              selectedDate={selectedDate}
              onBookingSuccess={handleBookingSuccess}
              onClose={handleCloseForm}
            />
          </div>
        )}
      </div>

      {showConfirmation && bookingData && (
        <BookingConfirmation
          bookingData={bookingData}
          onClose={handleCloseConfirmation}
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  )
}

export default Booking


