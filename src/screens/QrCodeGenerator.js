import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import "../styles/App.css";
import { Link } from "react-router-dom";

const QRCodeGenerator = () => {
  const [userData, setUserData] = useState(null);
  const loggedInUserID = localStorage.getItem("loggedInUserID");
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest.onrender.com";

  const BackButton = ({ loggedInUserID }) => {
    return (
      <div>
        {loggedInUserID !== null && (
          <>
            <button
              className={`text-white bg-[#4B558A] font-medium rounded-md font-medium rounded-md text-sm px-5 py-2.5 mx-5 hover:bg-[#3A426C] hover:drop-shadow-xl`}
            >
              Back
            </button>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${serverlessapi}/useruid/${loggedInUserID}`
        );
        // Use response.data instead of await response.json()
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [loggedInUserID]);

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h2 className="text-2xl text-center font-bold mb-4">Your QR Code</h2>
      {userData && (
        <div className="">
          <p className="mb-2 mx-auto text-center ">{`Username: ${
            userData.username || userData.first_name || "N/A"
          } ${userData.last_name || "N/A"}`}</p>
          <p className="mb-2 mx-auto text-center ">{`Job Title: ${
            userData.jobtitle || "N/A"
          } `}</p>
          <p className="mb-2 mx-auto text-center ">{`Company: ${
            userData.company || "N/A"
          }`}</p>
          <div className="mx-auto flex justify-center">
            <QRCode value={userData.linkedinurl} />
          </div>
        </div>
      )}
      <>
        {loggedInUserID !== null && (
          <div className="flex justify-center mt-4">
            <Link to={`/connect`}>
              <BackButton />
            </Link>
          </div>
        )}
      </>
    </div>
  );
};

export default QRCodeGenerator;
