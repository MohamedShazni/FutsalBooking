import Image1 from "../assets/2.jpg";
import { useNavigate } from "react-router-dom";

// Home Page Component
const HomePage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/contact");
  };
  return (
    <>
      <div className="min-h-screen bg-[#0c1a25] flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="w-full md:w-2/3 h-[50vh] md:h-screen relative">
          <img
            src={Image1}
            alt="futsal"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right Content Section */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-white py-10 md:py-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-[#00f0ff]">S</span>7{" "}
              <span className="text-[#00f0ff]">Futsal</span>
              <br />
              <p className="text-[50px]">
                <span className="text-[#00f0ff]">&</span> Sports
              </p>
            </h1>
            <p className="text-[26px] mb-2 font-bold">Your Game, Your Court</p>
            <p className="text-[18px] mb-2 italic">
              Book Your Court in a Click!
            </p>
            <p className="text-[18px] mb-5 italic">Kickoff & Have Fun</p>
            <button
              onClick={handleNext}
              className="bg-[#00f0ff] text-black px-10 py-4 text-[18px] font-semibold hover:bg-white hover:text-black hover:border-black"
            >
              Go Ahead!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
