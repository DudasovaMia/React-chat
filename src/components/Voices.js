import { useEffect, useState } from "react";
import axios from "axios";

const Voices = () => {
  const [voices, setVoices] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("http://localhost:4000/voices");
        if (response.ok) {
          const data = await response.json();
          const filteredVoices = data.voices.filter(
            (voice) =>
              (voice.from === localStorage.getItem("loggedInUserUsername") &&
                voice.to === localStorage.getItem("selectedUserUsername")) ||
              (voice.from === localStorage.getItem("selectedUserUsername") &&
                voice.to === localStorage.getItem("loggedInUserUsername"))
          );
          setVoices(filteredVoices);
        } else {
          console.error("Failed to fetch voices");
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchVoices();
  }, []);

  if (loading || voices === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {voices !== undefined &&
        voices.length > 0 &&
        voices
          .sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
          })
          .map((voice, i) => (
            <div
              key={i}
              style={{ width: "calc(100% / 4.5)" }}
              className="border-2 border-gray-700 rounded-md mx-2 my-1"
            >
              <audio controls>
                <source
                  src={"http://localhost:4000/uploads/voice/" + voice.filename}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
    </div>
  );
};

export default Voices;
