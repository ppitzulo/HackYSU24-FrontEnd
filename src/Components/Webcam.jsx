import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [prediction, setPrediction] = useState('');
    const captureInterval = 1500; // 500ms or half a second
    // const captureInterval = 2000; // 1000ms or 1 second
    useEffect(() => {
        const interval = setInterval(async () => {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            fetch(imageSrc)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], "filename.jpeg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append('file', file);
    
                // Ensure the endpoint and headers match your backend configuration
                axios.post('http://localhost:8000/predict/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                .then(response => {
                  // Log the entire response for debugging
                  console.log("Response:", response.data.predictions[0].predictions[0].tagName);
    
                  // Adjust based on your actual response structure
                  setPrediction(response.data.predictions[0].predictions[0].tagName);
                  console.log("Predictions:", response.data.predictions);
                })
                .catch(error => {
                  console.error('Error uploading image:', error);
                });
              });
          }
        }, []);
    
        return () => clearInterval(interval);
      }, []);

    return (
        <>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                }}
            />
            {prediction && <div>Prediction: {prediction}</div>}
        </>
    );
};

export default WebcamCapture;
