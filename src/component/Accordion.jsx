import { useState } from "react";
import { Rocket, ChevronsDown, ChevronsUp } from "lucide-react";


export default function Accordion({
  imageSrc,
  altText,
  showButton = false,
  buttonText = "",
  showRocket = false,
}) {
  const [isPicVisible, setIsPicVisible] = useState(false);

  const togglePic = () => setIsPicVisible((prev) => !prev);

  return (
    <div className="accordion flex flex-col items-center justify-center h-fit">
      <div
        className="cursor-pointer p-3 text-center font-bold"
        onClick={togglePic}
      >
        {isPicVisible ? <ChevronsUp /> : <ChevronsDown />}
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 flex flex-col items-center justify-center ${
          isPicVisible ? "max-h-screen" : "max-h-0"
        }`}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="w-full max-w-screen-lg h-auto"
          loading="lazy"
        />
        {showButton && (
          <button className="btn btn-outline btn-secondary m-3">
            {buttonText}
          </button>
        )}
        {showRocket && (
          <div className="rocket hidden">
            <Rocket />
          </div>
        )}
      </div>
    </div>
  );
}
