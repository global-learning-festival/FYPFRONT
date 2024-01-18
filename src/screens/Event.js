import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../images/Hero.png';
import MapDetail from '../components/mapdetail';
import { useParams } from 'react-router-dom';

const ViewEvent = () => {
  const [eventdata, setEventdata] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('Information');
  const { eventid } = useParams();

  const limitWords = (str, limit) => {
    const words = str.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
  };

  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://fyp-9bxz.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/events/${eventid}`);
        setEventdata(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };

    fetchData();
  }, [eventid]);

  useEffect(() => {
    const fetchAnnouncementsData = async () => {
      try {
        const response = await axios.get(`${localhostapi}/eventannouncements/${eventid}`);
        setAnnouncementsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };

    fetchAnnouncementsData();
  }, [eventid]);

  const FilterBar = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Information' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Information')}
        >
          Information
        </button>
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Announcements' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Announcements')}
        >
          Announcements
        </button>
      </div>
    );
  };

  if (eventdata.length === 0) {
    return <div>Loading...</div>;
  }

  const startDate = new Date(eventdata[0].time_start);
  const endDate = new Date(eventdata[0].time_end);

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

  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  return (
    <div>
      <img
        src={Hero}
        alt="Hero Banner"
        className="h-auto max-w-full mb-3"
      />

      <FilterBar /> 

      {currentCategory === 'Information' && (
        <div className="container mx-auto p-4">
          {eventdata.map((eventItem, index) => (
            <div key={index}>
              <h1 className="text-2xl font-bold mb-4">Title: {eventItem.title}</h1>
              <p className="mb-3 font-normal text-gray-700">
                Date: {formattedDate}, {startTime} - {endTime}
              </p>
              <p className="mb-3 font-normal text-gray-700">Location: {eventItem.location}</p>
              <p className="mb-3 font-normal text-gray-700">Keynote Speaker: {eventItem.keynote_speaker}</p>
              <p className="mb-3 font-normal text-gray-700">Description: {eventItem.description}</p>
              <div className='text-center'>
                <h1 className="text-2xl font-bold mb-4">We Need Your Feedback!</h1>
                <p className="mb-3 font-normal text-gray-700">
                  If you have attended this event, 
                  your feedback will be much appreciated
                </p>
                <a
                  href={eventItem.survey_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-white bg-[#0077B5] font-medium rounded-md text-sm px-5 py-2.5 hover:bg-[#3A426C] hover:drop-shadow-xl'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Survey
                </a>
              </div>
            </div>
          ))}
          {/* <MapDetail className="h-12" /> */}
        </div>
      )}

      {currentCategory === 'Announcements' && (
        <div className="text-center">
          {announcementsData.map((announcementItem, index) => (
            <div key={index}>
              <div
                className='flex-1 block m-2 p-4 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
                
              >
                <h5 className='mb-2 text-xl md:text-2xl font-bold tracking-tight text-black'>{announcementItem.title}</h5>
                <p className='font-normal text-sm md:text-base text-left text-gray-500 mb-4'>{limitWords(announcementItem.description, 10)}</p>
                <div className='flex justify-end'>
                  <div className='bg-teal-700 text-white rounded-full mr-0.5 py-1 px-2 h-6 md:h-8'>
                    <p className='text-xs md:text-sm'>
                        {announcementItem.created_on}
                    </p>
                  </div>
                  <div className='bg-blue-700 text-white rounded-full py-1 px-2 h-6 md:h-8'>
                    <p className='text-xs md:text-sm'>
                        {announcementItem.created_on}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEvent;