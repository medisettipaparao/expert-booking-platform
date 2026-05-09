import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001';

function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
    // eslint-disable-next-line
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/bookings`, {
        params: { email: user.email }
      });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.patch(`${API_URL}/bookings/${id}/status`, { status: 'Cancelled' });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="text-center mb-4">My Bookings</h1>

      {loading ? (
        <div className="text-center mt-4">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center mt-4 card">You have no bookings yet.</div>
      ) : (
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {bookings.map(booking => (
            <div key={booking._id} className="card">
              <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <span className={getStatusClass(booking.status)}>{booking.status}</span>
                <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                  Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="flex gap-4 mb-4">
                <img 
                  src={booking.expertId?.image || `https://i.pravatar.cc/150?u=${booking.expertId?._id}`} 
                  alt={booking.expertId?.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ marginBottom: '0.25rem', fontSize: '1.2rem' }}>{booking.expertId?.name}</h3>
                  <div className="badge badge-category">{booking.expertId?.category}</div>
                </div>
              </div>

              <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex items-center gap-2 text-secondary">
                  <CalendarIcon className="w-4 h-4" /> 
                  <span style={{ color: 'var(--text-primary)' }}>{format(new Date(booking.date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Clock className="w-4 h-4" /> 
                  <span style={{ color: 'var(--text-primary)' }}>{booking.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary mt-2" style={{ fontSize: '0.9rem' }}>
                  <User className="w-4 h-4" /> 
                  {booking.name} ({booking.phone})
                </div>
              </div>

              {['Pending', 'Confirmed'].includes(booking.status) && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)', textAlign: 'right' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
