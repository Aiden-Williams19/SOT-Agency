// Availability service for managing calendar data and booking logic
import { format, addDays, isWeekend } from 'date-fns'

// Mock availability data - in production, this would come from your backend/calendar API
const MOCK_AVAILABILITY = {
  // Working hours: 9 AM to 5 PM, Monday to Friday ONLY
  workingHours: {
    start: 9, // 9 AM
    end: 17,  // 5 PM
    days: [1, 2, 3, 4, 5] // Monday to Friday (1=Monday, 5=Friday)
  },
  
  // Pre-booked appointments (in production, fetch from your calendar)
  bookedSlots: [
    // These will be populated dynamically with current dates
  ],
  
  // Blocked dates (holidays, personal time, etc.)
  blockedDates: [
    // These will be populated dynamically with current dates
  ]
}

class AvailabilityService {
  constructor() {
    this.availability = MOCK_AVAILABILITY
    this.initializeSampleData()
  }

  // Initialize with some sample data for demonstration
  initializeSampleData() {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    
    // Only add sample booking if tomorrow is a weekday
    if (!isWeekend(tomorrow)) {
      this.availability.bookedSlots = [
        { 
          start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0, 0, 0), 
          end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0, 0, 0), 
          title: 'Client Meeting' 
        }
      ]
    } else {
      // If tomorrow is weekend, add booking to next weekday
      let nextWeekday = addDays(tomorrow, 1)
      while (isWeekend(nextWeekday)) {
        nextWeekday = addDays(nextWeekday, 1)
      }
      
      this.availability.bookedSlots = [
        { 
          start: new Date(nextWeekday.getFullYear(), nextWeekday.getMonth(), nextWeekday.getDate(), 10, 0, 0, 0), 
          end: new Date(nextWeekday.getFullYear(), nextWeekday.getMonth(), nextWeekday.getDate(), 11, 0, 0, 0), 
          title: 'Client Meeting' 
        }
      ]
    }
  }

  // Get available time slots for a specific date
  getAvailableSlots(date) {
    // Ensure we're working with a proper Date object
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    // Check if date is blocked or weekend (weekends are automatically excluded)
    if (this.isDateBlocked(checkDate) || isWeekend(checkDate)) {
      return []
    }

    const slots = []
    const { start: workStart, end: workEnd } = this.availability.workingHours
    
    // Generate hourly slots from 9 AM to 5 PM
    for (let hour = workStart; hour < workEnd; hour++) {
      const slotStart = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate(), hour, 0, 0, 0)
      const slotEnd = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate(), hour + 1, 0, 0, 0)
      
      // Check if this slot conflicts with existing bookings
      if (!this.isSlotBooked(slotStart, slotEnd)) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          available: true
        })
      }
    }
    
    return slots
  }

  // Check if a date is blocked
  isDateBlocked(date) {
    return this.availability.blockedDates.some(blockedDate => 
      format(blockedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  // Check if a date is a weekday (Monday to Friday)
  isWeekday(date) {
    const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
    return dayOfWeek >= 1 && dayOfWeek <= 5 // Monday to Friday
  }

  // Check if a time slot is already booked
  isSlotBooked(start, end) {
    return this.availability.bookedSlots.some(booking => {
      return (start < booking.end && end > booking.start)
    })
  }

  // Get upcoming available dates (next 14 days, weekdays only)
  getUpcomingAvailableDates(limit = 14) {
    const availableDates = []
    const today = new Date()
    
    for (let i = 1; i <= limit; i++) {
      const date = addDays(today, i)
      
      // Only include weekdays (Monday to Friday) - exclude weekends
      if (!isWeekend(date) && !this.isDateBlocked(date)) {
        const slots = this.getAvailableSlots(date)
        if (slots.length > 0) {
          availableDates.push({
            date,
            availableSlots: slots.length,
            slots: slots.slice(0, 3) // Show first 3 slots as examples
          })
        }
      }
    }
    
    return availableDates
  }

  // Get suggested dates for the chat bot
  getSuggestedDatesForBot() {
    const upcoming = this.getUpcomingAvailableDates(7) // Next 7 days
    return upcoming.slice(0, 3).map(item => {
      const timeSlots = item.slots.map(slot => 
        format(slot.start, 'HH:mm')
      ).join(' or ')
      
      return `${format(item.date, 'MMM dd')} at ${timeSlots}`
    })
  }

  // Book a time slot (mock implementation)
  bookSlot(start, end, clientInfo) {
    // Reject bookings on weekends
    if (isWeekend(start) || isWeekend(end)) {
      return { success: false, error: 'Weekends are unavailable' }
    }

    // Reject if slot conflicts with existing bookings
    if (this.isSlotBooked(start, end)) {
      return { success: false, error: 'Selected time is already booked' }
    }
    // In production, this would make an API call to your backend
    const newBooking = {
      start,
      end,
      title: `Meeting with ${clientInfo.name}`,
      clientInfo
    }
    
    this.availability.bookedSlots.push(newBooking)
    
    const confirmationCode = `SOT-${Date.now().toString().slice(-6)}`
    
    // Send confirmation email (in production, this would be a real email service)
    this.sendConfirmationEmail(clientInfo, newBooking, confirmationCode)
    
    return {
      success: true,
      booking: newBooking,
      confirmationCode
    }
  }

  // Send confirmation and reminder via bot (mock implementation)
  sendConfirmationEmail(clientInfo, booking, confirmationCode) {
    if (!clientInfo.notifyByEmail) return

    // Simulate bot-based email dispatch
    const sendAt = new Date()
    const reminderAt = new Date(booking.start.getTime() - 24 * 60 * 60 * 1000)

    console.log('[BOT] Queue email now:', {
      to: clientInfo.email,
      subject: `Appointment Confirmation - ${confirmationCode}`,
      when: sendAt.toISOString()
    })

    console.log('[BOT] Queue reminder 24h before:', {
      to: clientInfo.email,
      subject: 'Appointment Reminder (24 hours)',
      when: reminderAt.toISOString()
    })
  }

  // Get all bookings for calendar display
  getBookings() {
    return this.availability.bookedSlots.map(booking => ({
      id: booking.title,
      title: booking.title,
      start: booking.start,
      end: booking.end,
      resource: booking
    }))
  }

  // Check if any booking overlaps a given date
  hasAnyBookingOnDate(date) {
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayStart = new Date(check.getFullYear(), check.getMonth(), check.getDate(), 0, 0, 0, 0)
    const dayEnd = new Date(check.getFullYear(), check.getMonth(), check.getDate(), 23, 59, 59, 999)
    return this.availability.bookedSlots.some(booking => booking.start < dayEnd && booking.end > dayStart)
  }

  // Determine if a date is fully booked (no remaining available slots)
  isFullyBooked(date) {
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (isWeekend(check) || this.isDateBlocked(check)) return false
    return this.getAvailableSlots(check).length === 0 && this.hasAnyBookingOnDate(check)
  }

  // Check if a specific date has availability (weekdays only)
  hasAvailability(date) {
    // Ensure we're working with a proper Date object
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    // Check if date is blocked or weekend
    if (this.isDateBlocked(checkDate) || isWeekend(checkDate)) {
      return false
    }
    
    const slots = this.getAvailableSlots(checkDate)
    return slots.length > 0
  }
}

// Export singleton instance
export const availabilityService = new AvailabilityService()
export default availabilityService
