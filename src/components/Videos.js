import { useEffect, useState } from "react";
import axios from "axios";

const Videos = ({ loggedId, selectedId }) => {
  const [videos, setVideos] = useState();
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const to = localStorage.getItem("loggedInUserUsername");
        const from = localStorage.getItem("selectedUserUsername");
        const response = await axios
          .post("http://localhost:4000/getvideos?from=" + from + "&to=" + to)
          .then((req, res) => {
            setVideos(req.data.videos);
          });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchVideos();
  }, [loggedId, selectedId]);

  return (
    <div className="flex flex-wrap">
      {videos !== undefined &&
        videos.length > 0 &&
        videos
          .sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
          })
          .map((video, i) => (
            <div key={i} style={{width: "calc(100% / 4)"}} className="border-2 border-gray-700 rounded-md mx-2 my-1">
              <video width="500px" controls="controls">
                <source
                  src={"http://localhost:4000/uploads/video/" + video.filename}
                  type="video/mp4"
                />
              </video>{" "}
            </div>
          ))}
    </div>
  );
};

export default Videos;
