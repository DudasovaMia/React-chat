import { useEffect, useState } from "react";
import axios from "axios";

const Images = ({ loggedId, selectedId }) => {
  const [images, setImages] = useState();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const to = localStorage.getItem("loggedInUserUsername");
        const from = localStorage.getItem("selectedUserUsername");
        const response = await axios
          .post("http://localhost:4000/getimages?from=" + from + "&to=" + to)
          .then((req, res) => {
            setImages(req.data.images);
          });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchImages();
  }, [loggedId, selectedId]);

  return (
    <div className="flex flex-wrap">
      {images !== undefined &&
        images.length > 0 &&
        images
          .sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
          })
          .map((image, i) => (
            <div
              key={i}
              style={{ width: "calc(100% / 4.5)" }}
              className="border-2 border-gray-700 rounded-md mx-2 my-1"
            >
              {new Date(image.timestamp)
                .toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .replace(",", "")}
              {"  "}
              {image.from == localStorage.getItem("loggedInUserUsername")
                ? "by me"
                : image.from}
              <img
                src={"http://localhost:4000/uploads/images/" + image.filename}
                width={500}
              />
            </div>
          ))}
    </div>
  );
};

export default Images;
