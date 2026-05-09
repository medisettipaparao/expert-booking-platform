import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format, addDays } from 'date-fns';
import { Star, Clock, User, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

// Generate upcoming 7 days
const generateDates = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return format(d, 'yyyy-MM-dd');
  });
};

// Generate time slots (e.g., 9 AM to 5 PM, 1-hour slots)
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(generateDates()[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', notes: ''
  });
  const [bookingStatus, setBookingStatus] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const dates = generateDates();

  useEffect(() => {
    fetchExpertData();
    fetchBookedSlots();

    socket.on('booking_created', (data) => {
      if (data.expertId === id) {
        setBookedSlots(prev => [...prev, { date: data.date, timeSlot: data.timeSlot }]);
      }
    });

    socket.on('booking_cancelled', (data) => {
      if (data.expertId === id) {
        setBookedSlots(prev => prev.filter(b => !(b.date === data.date && b.timeSlot === data.timeSlot)));
      }
    });

    return () => {
      socket.off('booking_created');
      socket.off('booking_cancelled');
    };
    // eslint-disable-next-line
  }, [id]);

  const fetchExpertData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/experts/${id}`);
      setExpert(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bookings/slots/${id}`);
      setBookedSlots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const isSlotBooked = (date, slot) => {
    return bookedSlots.some(b => b.date === date && b.timeSlot === slot);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingStatus({ loading: false, error: 'Please select a time slot.', success: false });
      return;
    }

    setBookingStatus({ loading: true, error: null, success: false });
    try {
      await axios.post(`${API_URL}/bookings`, {
        expertId: id,
        ...formData,
        date: selectedDate,
        timeSlot: selectedSlot
      });
      setBookingStatus({ loading: false, error: null, success: true });
      setSelectedSlot(null);
      setFormData({ name: '', email: '', phone: '', notes: '' });
      // Remove success message after 3 seconds
      setTimeout(() => setBookingStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      setBookingStatus({ 
        loading: false, 
        error: err.response?.data?.error || 'Something went wrong', 
        success: false 
      });
    }
  };

  if (!expert) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
      {/* Left: Profile */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="text-center">
          <img 
            src={expert.image || `https://i.pravatar.cc/150?u=${expert._id}`} 
            alt={expert.name} 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
          />
          <h2>{expert.name}</h2>
          <div className="badge badge-category mb-2">{expert.category}</div>
          <p className="text-secondary mb-2">{expert.experience} Years Experience</p>
          <div className="flex justify-center items-center gap-1 mb-4">
            <Star className="w-5 h-5 fill-current text-warning" style={{ color: '#f59e0b' }} />
            <span style={{ fontWeight: 'bold' }}>{expert.rating}</span>
          </div>
        </div>
      </div>

      {/* Right: Booking Form & Slots */}
      <div className="card">
        <h3>Book a Session</h3>
        
        {bookingStatus.success && (
          <div className="success-msg">Booking confirmed successfully!</div>
        )}
        {bookingStatus.error && (
          <div className="error-msg mb-2">{bookingStatus.error}</div>
        )}

        <div className="mb-4">
          <label className="input-label">Select Date</label>
          <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {dates.map(date => (
              <button 
                key={date}
                className={`btn ${selectedDate === date ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {format(new Date(date), 'MMM dd')}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="input-label">Available Time Slots</label>
          <div className="slot-grid">
            {timeSlots.map(slot => {
              const booked = isSlotBooked(selectedDate, slot);
              return (
                <button
                  key={slot}
                  disabled={booked}
                  className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {user ? (
          <form onSubmit={handleBooking} className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label"><User className="w-4 h-4 inline mr-1" /> Name</label>
              <input 
                type="text" required className="input-field" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                readOnly
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label"><Mail className="w-4 h-4 inline mr-1" /> Email</label>
              <input 
                type="email" required className="input-field" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                readOnly
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label"><Phone className="w-4 h-4 inline mr-1" /> Phone</label>
            <input 
              type="tel" required className="input-field" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Notes (Optional)</label>
            <textarea 
              className="input-field" rows="3"
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }} disabled={bookingStatus.loading}>
            {bookingStatus.loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
        ) : (
          <div className="text-center mt-4 p-4 card" style={{ background: '#f8fafc', border: '1px solid var(--border-color)' }}>
            <p className="mb-2">Please login to book a session.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login to Book</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpertDetail;
