import React, { useState, useEffect } from 'react';
import { User, Stethoscope, Building2, Calendar, Clock, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AppointmentCard = ({ doctor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Only allow future dates that match doctor's available days
  const filterAvailableDates = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return (
      date >= new Date().setHours(0, 0, 0, 0) &&
      doctor.availableDays.includes(dayName)
    );
  };

  // Generate time slots based on doctor's availability
  const getAvailableTimeSlots = () => {
    if (!doctor.timeSlots) return [];
    
    const [startHour, startMin] = doctor.timeSlots.start.split(':');
    const [endHour, endMin] = doctor.timeSlots.end.split(':');
    
    let slots = [];
    let current = new Date();
    current.setHours(parseInt(startHour), parseInt(startMin), 0);
    
    const end = new Date();
    end.setHours(parseInt(endHour), parseInt(endMin), 0);
    
    while (current < end) {
      slots.push(current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
      current.setMinutes(current.getMinutes() + 30);
    }
    
    return slots;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        age: new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear(),
        image: userData.image || '',
        organizationType: doctor.organizationType,
        organizationName: doctor.organizationName,
        organizationEmail: doctor.organizationEmail,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        appointmentDate: selectedDate,
        fees: doctor.consultationFees,
        timeSlots: {
          start: selectedTime,
          end: new Date(new Date(`2000/01/01 ${selectedTime}`).getTime() + 30*60000)
            .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        },
        status: 'Pending'
      };

      const response = await axios.post(
        'https://medico-care-theta.vercel.app/api/appointments/create',
        appointmentData,{
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl p-6 w-full max-w-md mx-auto shadow-xl"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Existing content */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Doctor Info Card */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Doctor Name</p>
                <p className="font-medium text-gray-900">{doctor.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Specialization</p>
                <p className="font-medium text-gray-900">{doctor.specialties.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Organization</p>
                <p className="font-medium text-gray-900">{doctor.organizationName}</p>
              </div>
            </div>

            {doctor.timeSlots && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Working Hours</p>
                  <p className="font-medium text-gray-900">
                    {doctor.timeSlots.start} - {doctor.timeSlots.end}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                filterDate={filterAvailableDates}
                minDate={new Date()}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholderText="Choose available date"
                dateFormat="MMMM d, yyyy"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {getAvailableTimeSlots().map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        p-2 text-sm rounded-lg border transition-all
                        ${selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedDate || !selectedTime}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;