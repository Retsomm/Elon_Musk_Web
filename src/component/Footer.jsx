import Accordion from "./Accordion";

export default function Footer() {
  return (
    <footer>
      <Accordion imageSrc="/mars.webp" altText="mars" />
      <div className="contact h-15 flex justify-center items-center p-5">
        If there is any infringement, please email to 112182ssss@gmail.com
      </div>
    </footer>
  );
}
