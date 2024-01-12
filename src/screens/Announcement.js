import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Announcement = ({ announcementid, title, description, announcement_posted, announcement_updated, onClick }) => {
  // Function to limit words in a string
  const limitWords = (str, limit) => {
    const words = str.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
  };

  const limitedDescription = limitWords(description, 10);

  return (
    <div
      className='flex-1 block m-2 max-w-sm p-4 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
      onClick={onClick}
    >
      <h5 className='mb-2 text-xl md:text-2xl font-bold tracking-tight text-black'>{title}</h5>
      <p className='font-normal text-sm md:text-base text-gray-500 mb-4'>{limitedDescription}</p>
      <div className='bg-teal-700 text-white rounded-full py-1 px-2 absolute bottom-2 right-2 h-6 md:h-8'>
        <p className='text-xs md:text-sm'>
          {announcement_posted === announcement_updated
            ? `${announcement_posted}`
            : `${announcement_updated}`}
        </p>
      </div>
    </div>
  );
};

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/announcements');
        console.log(response)
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []); 

  const handleViewAnnouncementClick = (announcementid) => {
    navigate(`/viewannouncement/${announcementid}`); 
    console.log('indidcheck', announcementid)
  };
  
  const rows = [];
  const cardsPerRow = 3;

  for (let i = 0; i < announcements.length; i += cardsPerRow) {
    const row = announcements.slice(i, i + cardsPerRow);
    rows.push(
      <div key={i / cardsPerRow} className='sm:flex sm:flex-wrap justify-center'>
        {row.map((announcementItem, index) => (
          <Announcement
            key={index}
            title={announcementItem.title}
            description={announcementItem.description}
            announcement_posted={announcementItem.created_on}
            announcement_updated={announcementItem.updated_on}
            {...announcementItem}
            onClick={ ()=> handleViewAnnouncementClick(announcementItem.announcementid) }
          />
        ))}
      </div>
    );
  }

  return <>{rows}</>;
};

export default AnnouncementList;
