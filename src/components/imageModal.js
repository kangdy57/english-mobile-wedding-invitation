import { ReactComponent as LeftArrow } from '../assets/arrow-left.svg';
import { ReactComponent as RightArrow } from '../assets/arrow-right.svg';

const ImageModal = ({ clickedImg, handleRotationRight, handleRotationLeft, setClickedImg }) => {
  const handleClick = (e) => {
    if (e.target.classList.contains("dismiss")) {
      setClickedImg(null);
    }
  };

  // Only render the modal if clickedImg is set
  if (!clickedImg) return null;

  return (
    <div className="overlay dismiss" onClick={handleClick}>
      <img
        loading="lazy"
        src={clickedImg}
        alt="original size"
      />
      <span className="dismiss" onClick={handleClick}>X</span>
      <div onClick={handleRotationRight}>
        <RightArrow className="overlay-arrows_right" width="50" height="50" />
      </div>
      <div onClick={handleRotationLeft}>
        <LeftArrow className="overlay-arrows_left" width="50" height="50" />
      </div>
    </div>
  );
};

export default ImageModal;
