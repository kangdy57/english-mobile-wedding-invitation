import React, { useState } from "react";
import data from "../assets/image_data.json";
import pinIcon from "../assets/location-pin.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import "../App.css";
import ImageModal from "../components/imageModal";
import mainImage from "./mainImage.jpg";
import no1 from "./no1.jpg";
import no2 from "./no2.jpg";
import no3 from "./no3.jpg";
import no4 from "./no4.jpg";
import no5 from "./no5.jpg";
import no6 from "./no6.jpg";
import no7 from "./no7.jpg";
import no8 from "./no8.jpg";
import no9 from "./no9.jpg";
import no10 from "./no10.jpg";
import no11 from "./no11.jpg";
import no12 from "./no12.jpg";

function Bride() {
  // state for image modal
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const navermaps = useNavermaps();

  const imageMap = {
    "no1.jpg": no1,
    "no2.jpg": no2,
    "no3.jpg": no3,
    "no4.jpg": no4,
    "no5.jpg": no5,
    "no6.jpg": no6,
    "no7.jpg": no7,
    "no8.jpg": no8,
    "no9.jpg": no9,
    "no10.jpg": no10,
    "no11.jpg": no11,
    "no12.jpg": no12,
  };

  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(imageMap[item.link]);
  };

  const handleRotationRight = () => {
    const totalLength = data.data.length;
    let newIndex;
    if (currentIndex + 1 >= totalLength) {
      newIndex = 0;
    } else {
      newIndex = currentIndex + 1;
    }
    const newItem = data.data[newIndex].link;
    setClickedImg(imageMap[newItem]);
    setCurrentIndex(newIndex);
  };

  const handleRotationLeft = () => {
    const totalLength = data.data.length;
    let newIndex;
    if (currentIndex === 0) {
      newIndex = totalLength - 1;
    } else {
      newIndex = currentIndex - 1;
    }
    const newItem = data.data[newIndex].link;
    setClickedImg(imageMap[newItem]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="">
      <div className="main container">
        <div className="row justify-content-md-center">
          <div className="col col-md-2 col-lg-3"></div>

          <div className="col-md">
            <div className="mainsection">
              <div>
                <img src={mainImage} className="main-image" alt="t1" />
              </div>
              <div className="mainsection-text">
                <div className="mainsection-text-1">We are getting married!</div>
                <div className="mainsection-text-2">
                  Dayeon Kang<span className="text2-inner"> & </span> Prannoy Mulmi
                </div>
                <div className="mainsection-text-3">
                  2026. 10. 24 Saturday 3pm
                  <br />
                  Sejong Memorial Hall
                </div>
              </div>
            </div>
            <div className="invitation-section">
              <div className="invitation-section-text1">INVITATION</div>
              <div className="invitation-section-text2">
                <strong>Dayeon</strong>, born in <strong>Korea</strong>,<br />
                and <strong>Prannoy</strong>, born in <strong>Nepal</strong>,<br />
                met by fate in <strong>Germany, Hamburg</strong>,<br />
                and are now building a life together as a family.<br />
                We warmly invite you to join us<br />
                as we celebrate our new beginning at our<br />
                 <strong>traditional wedding ceremony</strong>.
              </div>
              <div className="invitation-section-text3">
                Jungbae Kang・Hyojung Jin<span className="text3-inner">'s daughter</span> Dayeon Kang
              </div>
              <div className="invitation-section-text3">
                Ram Mulmi・Janahita Mulmi
                <span className="text3-inner">'s son</span> Prannoy Mulmi
              </div>
            </div>
            <div className="gallery-section">
              <div className="gallery-section-text">GALLERY</div>
            </div>
            <div>
              <div className="gallery-image-list-wrapper row">
                {data.data.map((item, index) => (
                  <div key={index} className="col-4">
                    <img
                      className="gallery-image"
                      src={imageMap[item.thumb_image_link]}
                      alt={item.text}
                      onClick={() => handleClick(item, index)}
                    />
                  </div>
                ))}
              </div>
              {clickedImg && (
                <ImageModal
                  clickedImg={clickedImg}
                  handleRotationRight={handleRotationRight}
                  handleRotationLeft={handleRotationLeft}
                  setClickedImg={setClickedImg}
                />
              )}
            </div>
            <div className="location-section">
              <div className="location-section-text1">LOCATION</div>
            </div>
            <div className="location-map-section">
              <MapDiv
                style={{
                  width: "100%",
                  height: "350px",
                }}
              >
                <NaverMap
                  defaultCenter={
                    new navermaps.LatLng(37.5909615011864, 127.04363162642107)
                  }
                  defaultZoom={16}
                >
                  <Marker
                    position={
                      new navermaps.LatLng(37.5909615011864, 127.04363162642107)
                    }
                    icon={{
                      url: pinIcon,
                      size: new navermaps.Size(64, 64),
                    }}
                  />
                </NaverMap>
              </MapDiv>
            </div>
            <div className="location-info-section">
              <div className="location-info-section-text1">Sejong Memorial Hall</div>
              <div className="location-info-section-text2">
                Hoegiro 56-gil, Hoegi-dong, Dongdaemun-gu, Seoul, South Korea
                <br />
                Tel. 02-960-1700
              </div>
            </div>
            <div className="location-how-publictrans-section">
              <div className="location-how-publictrans-section-text1">
                Public Transportation
              </div>
              <ol className="location-how-publictrans-section-list">
                <li>
                  <strong>Subway</strong> <br />
                  Goyrodae Station (고려대역) on Line 6, Exit no.3 <br />
                </li>
                <li>
                  <strong>Bus</strong> <br />
                  no. 1226, 201, 273 <br />
                </li>
              </ol>
            </div>
            <div className="location-how2-section">
              <div className="location-how2-section-text1">Car</div>
              <div className="location-how2-section-text2">
                Hoegiro 56-gil, Hoegi-dong, Dongdaemun-gu, Seoul, South Korea
                <br />
                (Free Parking)
              </div>
            </div>
            <div className="general-info-section">
              <div className="general-info-section-text1">For Your Information</div>
              <div className="general-info-section-text2">
                Many of our guests will be wearing hanbok, Korean traditional dress, to experience the beauty of Korean tradition.
                If you happen to own a hanbok, please feel free to wear it as well.
                <br />
                Of course, wearing a hanbok is by no means required — we would be grateful for your presence, whatever you feel most comfortable in.
                <br />
                <br />
                <br />
                <br />
                <strong>Example Video of Korean Traditional Wedding</strong>
                <br />
                <div className="video-wrapper">
                  <iframe
                    title="전통혼례예시"
                    src="https://www.youtube.com/embed/oFP1a4Ra2Qs"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
          <div className="col col-md-2 col-lg-3"></div>
        </div>
        <div className="footer">
          We look forward to celebrating this special day with you in Korea!<br />
          <br />
          © 2025 Prannoy & Dayeon
        </div>
      </div>
    </div>
  );
}

export default Bride;
