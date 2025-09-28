import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns'
import availabilityService from '../services/availabilityService'
import './SimpleCalendar.css'

function SimpleCalendar({ onSelectSlot, selectedDate, onDateChange }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(date => 
    new Date(date.getFullYear(), date.getMonth(), date.getDate())
  )

  // Build a 7xN grid aligned to weekday headers (Sun..Sat)
  const leadingBlanks = monthStart.getDay() // 0=Sun ... 6=Sat
  const cells = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(null)
  monthDays.forEach(d => cells.push(d))
  const trailingBlanks = (7 - (cells.length % 7)) % 7
  for (let i = 0; i < trailingBlanks; i++) cells.push(null)
  
  const handleDateClick = (date) => {
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    // Disallow weekends entirely
    if (isWeekend(cleanDate)) return
    if (availabilityService.hasAvailability(cleanDate)) {
      onDateChange(cleanDate)
      onSelectSlot({ start: cleanDate })
    }
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  
  const getDayClass = (date) => {
    let className = 'calendar-day'
    
    // Ensure we're working with clean date objects
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const today = new Date()
    const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    if (isSameDay(cleanDate, cleanToday)) {
      className += ' today'
    }
    
    if (selectedDate && isSameDay(cleanDate, selectedDate)) {
      className += ' selected'
    }
    
    // Weekends are always greyed out
    if (isWeekend(cleanDate)) {
      className += ' weekend'
    } else {
      // Weekdays default to green
      className += ' available'
      // If fully booked, mark as unavailable (red overrides green)
      if (availabilityService.isFullyBooked(cleanDate)) {
        className += ' unavailable'
      }
    }
    
    return className
  }
  
  return (
    <div className="simple-calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-btn">←</button>
        <h3>{format(currentDate, 'MMMM yyyy')}</h3>
        <button onClick={goToNextMonth} className="nav-btn">→</button>
      </div>
      
      <div className="calendar-grid">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>
        
        {cells.map((day, index) => {
          if (!day) {
            return (
              <div key={index} className="calendar-day outside"></div>
            )
          }
          return (
            <div
              key={index}
              className={getDayClass(day)}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available (Mon-Fri)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unavailable"></span>
          <span>Booked/Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot weekend"></span>
          <span>Weekend (Closed)</span>
        </div>
      </div>
    </div>
  )
}

export default SimpleCalendar
