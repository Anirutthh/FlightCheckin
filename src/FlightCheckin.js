import React, { useState, useEffect } from 'react';

function FlightCheckin() {
  const initialFlights = [
    {
      id: 1,
      flightNo: '6E-201',
      destination: 'Bangalore',
      time: '23:30',
      gate: 'A2',
      checkedIn: false,
      passenger: '',
    },
    {
      id: 2,
      flightNo: '6E-450',
      destination: 'Chennai',
      time: '23:45',
      gate: 'B4',
      checkedIn: false,
      passenger: '',
    },
    {
      id: 3,
      flightNo: '6E-312',
      destination: 'Hyderabad',
      time: '00:15',
      gate: 'C1',
      checkedIn: false,
      passenger: '',
    },
  ];

  const [flights, setFlights] = useState(() => {
    const stored = localStorage.getItem('flightsData');
    return stored ? JSON.parse(stored) : initialFlights;
  });

  // Save to localStorage on every update
  useEffect(() => {
    localStorage.setItem('flightsData', JSON.stringify(flights));
  }, [flights]);

  const handleCheckin = (id) => {
    const updatedFlights = flights.map((flight) =>
      flight.id === id ? { ...flight, checkedIn: true } : flight
    );
    setFlights(updatedFlights);
  };

  const handleCancel = (id) => {
    const updatedFlights = flights.map((flight) =>
      flight.id === id ? { ...flight, checkedIn: false, passenger: '' } : flight
    );
    setFlights(updatedFlights);
  };

  const handleNameChange = (id, value) => {
    const updatedFlights = flights.map((flight) =>
      flight.id === id ? { ...flight, passenger: value } : flight
    );
    setFlights(updatedFlights);
  };

  const getTimeLeft = (flightTime) => {
    const now = new Date();
    const [hours, minutes] = flightTime.split(':');
    const flightDate = new Date();
    flightDate.setHours(parseInt(hours));
    flightDate.setMinutes(parseInt(minutes));
    flightDate.setSeconds(0);
    let diff = (flightDate - now) / 60000; // in minutes
    if (diff < 0) diff = 0;
    return Math.floor(diff);
  };

  const totalCheckedIn = flights.filter((flight) => flight.checkedIn).length;

  const getCardColor = (destination) => {
    switch (destination) {
      case 'Bangalore':
        return '#e0f7fa';
      case 'Chennai':
        return '#ffe0b2';
      case 'Hyderabad':
        return '#e1bee7';
      default:
        return '#ffffff';
    }
  };

  const checkedInPassengers = flights.filter((f) => f.checkedIn);

  return (
    <div>
      <h2>✈️ Indigo Flight Check-in Desk</h2>
      <p><strong>Total Passengers Checked-in:</strong> {totalCheckedIn}</p>

      {flights.map((flight) => {
        const timeLeft = getTimeLeft(flight.time);
        const isLate = timeLeft <= 30;

        return (
          <div
            key={flight.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              backgroundColor: getCardColor(flight.destination),
            }}
          >
            <p><strong>Flight No:</strong> {flight.flightNo}</p>
            <p><strong>Destination:</strong> {flight.destination}</p>
            <p><strong>Departure Time:</strong> {flight.time}</p>
            <p><strong>Gate:</strong> {flight.gate}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{ color: flight.checkedIn ? 'green' : 'red' }}>
                {flight.checkedIn ? 'Checked-in ✅' : 'Waiting'}
              </span>
            </p>
            <p>
              <strong>Time Left:</strong> {timeLeft} mins
              {isLate && !flight.checkedIn ? ' (Check-in closing soon!)' : ''}
            </p>

            <input
              type="text"
              placeholder="Enter Passenger Name"
              value={flight.passenger}
              onChange={(e) => handleNameChange(flight.id, e.target.value)}
              disabled={flight.checkedIn || isLate}
            />

            <button
              onClick={() => handleCheckin(flight.id)}
              disabled={flight.checkedIn || flight.passenger === '' || isLate}
              style={{ marginLeft: '10px' }}
            >
              {flight.checkedIn ? 'Boarding Pass Issued ✅' : 'Check-in'}
            </button>

            <button
              onClick={() => handleCancel(flight.id)}
              disabled={!flight.checkedIn}
              style={{
                marginLeft: '10px',
                backgroundColor: 'crimson',
                color: 'white',
              }}
            >
              Cancel Check-in
            </button>
          </div>
        );
      })}

      <div style={{ marginTop: '20px', borderTop: '2px solid #333', paddingTop: '10px' }}>
        <h3>📝 Checked-in Passengers:</h3>
        {checkedInPassengers.length === 0 ? (
          <p>No one has checked-in yet.</p>
        ) : (
          <ul>
            {checkedInPassengers.map((f) => (
              <li key={f.id}>
                {f.passenger} ({f.flightNo} to {f.destination})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FlightCheckin;
