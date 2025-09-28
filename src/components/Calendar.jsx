import React, { useState, useCallback } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import availabilityService from '../services/availabilityService'
import './Calendar.css'

// Setup the localizer with moment
const localizer = momentLocalizer(moment)

function Calendar({ onSelectSlot, selectedDate, onDateChange }) {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  // Get events for the calendar
  const events = availabilityService.getBookings()

  // Handle date selection
  const handleSelectSlot = useCallback((slotInfo) => {
    const selectedDate = slotInfo.start
    onDateChange(selectedDate)
    onSelectSlot(slotInfo)
  }, [onDateChange, onSelectSlot])

  // Handle date navigation
  const handleNavigate = useCallback((newDate) => {
    setDate(newDate)
  }, [])

  // Custom event style
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#e74c3c',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  // Custom day cell style
  const dayPropGetter = (date) => {
    const hasAvailability = availabilityService.hasAvailability(date)
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    
    let className = 'calendar-day'
    
    if (isToday) className += ' today'
    if (isSelected) className += ' selected'
    if (hasAvailability) className += ' available'
    if (!hasAvailability) className += ' unavailable'
    
    return { className }
  }

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button onClick={() => onNavigate('PREV')} className="nav-btn">
          ← Previous
        </button>
        <span className="toolbar-label">{label}</span>
        <button onClick={() => onNavigate('NEXT')} className="nav-btn">
          Next →
        </button>
      </div>
      <div className="toolbar-right">
        <button 
          onClick={() => onView('month')} 
          className={view === 'month' ? 'view-btn active' : 'view-btn'}
        >
          Month
        </button>
        <button 
          onClick={() => onView('week')} 
          className={view === 'week' ? 'view-btn active' : 'view-btn'}
        >
          Week
        </button>
        <button 
          onClick={() => onView('day')} 
          className={view === 'day' ? 'view-btn active' : 'view-btn'}
        >
          Day
        </button>
      </div>
    </div>
  )

  return (
    <div className="calendar-container">
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot booked"></span>
          <span>Booked</span>
        </div>
      </div>
      
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={handleNavigate}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: CustomToolbar
        }}
        views={['month', 'week', 'day']}
        step={60}
        timeslots={1}
        min={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0)}
        max={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0)}
      />
    </div>
  )
}

export default Calendar
