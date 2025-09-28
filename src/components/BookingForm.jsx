import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import availabilityService from '../services/availabilityService'
import './BookingForm.css'

function BookingForm({ selectedDate, onBookingSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    notifyByEmail: true
  })
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = availabilityService.getAvailableSlots(selectedDate)
      setAvailableSlots(slots)
      setSelectedSlot(null) // Reset selection
    }
  }, [selectedDate])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!selectedSlot) {
      newErrors.slot = 'Please select a time slot'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Book the slot
      const result = availabilityService.bookSlot(
        selectedSlot.start,
        selectedSlot.end,
        formData
      )
      
      if (result.success) {
        onBookingSuccess({
          ...result,
          clientInfo: formData,
          selectedDate: selectedDate,
          selectedSlot: selectedSlot
        })
      }
    } catch (error) {
      console.error('Booking error:', error)
      setErrors({ submit: 'Failed to book appointment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedDate) {
    return (
      <div className="booking-form-container">
        <div className="no-date-selected">
          <h3>Select a Date</h3>
          <p>Please select a date from the calendar to see available time slots.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h3>Book Appointment</h3>
        <p className="selected-date">
          {format(selectedDate, 'EEEE, MMMM do, yyyy')}
        </p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Time Slot Selection */}
        <div className="form-section">
          <label className="form-label">Available Time Slots</label>
          <div className="time-slots">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
                </button>
              ))
            ) : (
              <p className="no-slots">No available slots for this date</p>
            )}
          </div>
          {errors.slot && <span className="error-message">{errors.slot}</span>}
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <label className="form-label">Personal Information</label>
          
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        {/* Notifications */}
        <div className="form-section">
          <label className="form-label">Notifications</label>
          <label className="checkbox">
            <input
              type="checkbox"
              name="notifyByEmail"
              checked={formData.notifyByEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, notifyByEmail: e.target.checked }))}
            />
            <span>Send me an email confirmation and a reminder 24 hours before</span>
          </label>
          <p className="muted">Emails are sent by our assistant bot. We never auto-email from your address.</p>
        </div>

        {/* Service Selection */}
        <div className="form-section">
          <label className="form-label">Service Type</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select a service</option>
            <option value="consultation">Free Consultation</option>
            <option value="web-development">Web Development</option>
            <option value="film-editing">Film & Video Editing</option>
            <option value="photography">Photography</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Additional Message */}
        <div className="form-section">
          <label className="form-label">Additional Information</label>
          <textarea
            name="message"
            placeholder="Tell us about your project or any specific requirements..."
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="form-textarea"
          />
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          {errors.submit && (
            <span className="error-message submit-error">{errors.submit}</span>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !selectedSlot}
            className="submit-btn"
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookingForm
