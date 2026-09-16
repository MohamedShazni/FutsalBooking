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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <button
                onClick={handleNext}
                className="bg-[#00f0ff] text-black px-8 py-2 rounded-full text-[18px] font-semibold hover:bg-white hover:text-black hover:border-black transition-all duration-300 shadow-lg shadow-[#00f0ff]/20"
              >
                Go Ahead!
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="bg-transparent border border-[#00f0ff]/40 text-[#00f0ff] px-6 py-2 rounded-full text-[16px] font-semibold hover:bg-[#00f0ff]/10 transition-all duration-300"
              >
                Admin Console
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
