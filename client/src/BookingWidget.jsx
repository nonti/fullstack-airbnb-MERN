import PropTypes from 'prop-types';
import { useState } from 'react';
import {differenceInCalendarDays} from 'date-fns';

const BookingWidget = ({place}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  let numberOfNights = 0;
  if(checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkIn), new Date(checkOut));
  }
  return (
    <div>
      <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
              Price: R{place.price} /night
            </div>
            <div className="border rounded-2xl mt-4">
              <div className="flex">
                <div className="py-3 px-4">
                  <label>Check in:</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
                </div>
                <div className="py-3 px-4 border-l">
                  <label>Check out:</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}/>
                </div>
                <div className="py-3 px-4 border-l">
                  <label>Number of guests:</label>
                  <input type="number" value={numberOfGuests} onChange={e=> setNumberOfGuests(e.target.value)}/>
                </div>
              </div>
            </div>
              {numberOfNights > 0 && (
                <div className="py-3 px-4 border-l">
                <label>Your Fullname:</label>
                <input type="text" value={name} onChange={e=> setName(e.target.value)}/>
                <label>Phone number:</label>
                <input type="tel" value={mobile} onChange={e=> setMobile(e.target.value)}/>
              </div>
              )}
            <button className="primary mt-4">
              Book this place
              {numberOfNights > 0 && (
                <span>
                  R{numberOfNights * place.price}
                </span>
              )}
              </button>
          </div>
    </div>
  )
}


BookingWidget.propTypes = {
  place: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default BookingWidget;