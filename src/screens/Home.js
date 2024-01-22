  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import Hero from '../images/Hero.png';
  import { useNavigate } from 'react-router-dom';
  import saveevent from '../assets/savedevent.png'
  import unsaveevent from '../assets/unsaveevent.png'

  const Home = ({ eventid, title, description, formattedDate, startTime, endTime, onClick }) => {
    
    const limitWords = (str, limit) => {
      const words = str.split(' ');
      return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
    };

    const limitedDescription = limitWords(description, 10);

      return (
        <>
        <div className='m-2'>
          <div 
            className="relative mx-auto sm:mx-0 max-w-sm bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={onClick}
          >
            <img
              src={Hero}
              alt="Hero Banner"
              className="rounded-t-lg h-auto max-w-full"
            />
            
              <div className="p-3">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
                <p className="mb-3 font-normal text-gray-700">{limitedDescription}</p>
                <div className='flex justify-end'>
                  <div className='bg-[#293262] text-white rounded-full mr-0.5 py-1 px-2.5 h-6 md:h-8'>
                    <p className='text-xs md:text-sm'>
                        {formattedDate}
                    </p>
                  </div>
                  <div className='bg-[#487572] text-white rounded-full py-1 px-2.5 h-6 md:h-8'>
                    <p className='text-xs md:text-sm'>
                        {startTime} - {endTime}
                    </p>
                  </div>
                </div>
                <a href={'viewevent?eventid=' + eventid}/>
              </div>
          </div>
        </div>
        </>
      );
    };

    const FilterBar = ({ currentCategory, setCurrentCategory }) => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'All' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('All')}
        >
          All
        </button>
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Ongoing' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Saved' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Saved')}
        >
          Saved
        </button>
      </div>
    );
  };

  const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('All');
    const navigate = useNavigate();
    const localhostapi = "http://localhost:5000";
    const serverlessapi = "https://fyp-9bxz.onrender.com";

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`${serverlessapi}/events`);
          setEvents(response.data);

          // Conditionally filter events based on the current category
          if (currentCategory === 'Ongoing') {
            const currentDate = new Date().toISOString(); // Current date and time in UTC string

            const filtered = response.data.filter(eventItem => {
              const startTime = new Date(eventItem.time_start);
              const endTime = new Date(eventItem.time_end);
              const currentTime = new Date(currentDate);

              return startTime <= currentTime && currentTime <= endTime;
            });

            setFilteredEvents(filtered);
            // console.log(filtered);
          } else {
            setFilteredEvents(response.data);
            // console.log(response.data);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    }, [currentCategory]);

    const rows = [];
    const cardsPerRow = 3;

    for (let i = 0; i < filteredEvents.length; i += cardsPerRow) {
      const row = filteredEvents.slice(i, i + cardsPerRow);
      
      rows.push(
        <div key={i / cardsPerRow} className='sm:flex sm:flex-wrap justify-center'>
          {row.map((eventItem, index) => {
            const startDate = new Date(eventItem.time_start);
            const formattedDate = startDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: 'Asia/Singapore',
            });

            const startTime = startDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'Asia/Singapore',
            });

            const endDate = new Date(eventItem.time_end);
            const endTime = endDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'Asia/Singapore',
            });

            return (
              <Home
                key={index}
                title={eventItem.title}
                description={eventItem.description}
                event_start={eventItem.time_start}
                event_end={eventItem.time_end}
                formattedDate={formattedDate}
                startTime={startTime}
                endTime={endTime}
                {...eventItem}
                onClick={() => handleViewEventClick(eventItem.eventid)}
              />
            );
          })}
        </div>
      );
    }

    const handleViewEventClick = (eventid) => {
      navigate(`/viewevent/${eventid}`);
      // console.log('indidcheck', eventid);
    };

    return (
      <>
        <FilterBar currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
        {rows}
      </>
    );
  };

  export default EventsList;