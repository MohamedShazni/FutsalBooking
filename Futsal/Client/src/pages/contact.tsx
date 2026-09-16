import { Card, CardContent } from "@/components/ui/card";
import Image2 from "../assets/4.jpg";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const name = e.target.elements[0].value.trim();
    const mobile = e.target.elements[1].value.trim();

    if (
      name !== "" && // Name validation
      /^[0-9]{10}$/.test(mobile) // Mobile validation
    ) {
      navigate("/booking", {
        state: { customerName: name, customerMobile: mobile },
      });
    } else {
      alert("Please enter valid details!");
    }
  };
  return (
    <>
      <div className="min-h-screen bg-[#0c1a25] flex flex-col md:flex-row">
        {/* Left content */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-white py-10 md:py-0 order-2 md:order-1">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-[#00f0ff]">S</span>7{" "}
              <span className="text-[#00f0ff]">Futsal</span>
              <br />
              <p className="text-[50px]">
                <span className="text-[#00f0ff]">&</span> Sports
              </p>
            </h1>
            <p className="text-[26px] mb-2 font-bold">Connect with us,</p>
            <p className="text-[18px] mb-2 italic">
              Just click the <span className="text-[#00f0ff]">Book Now </span>{" "}
              and Book your slots soon!
            </p>
            <div className="mb-5 w-full">
              <form onSubmit={handleSubmit}>
                <Card className="bg-[#0c1a25] border-none">
                  <CardContent>
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      className="w-full bg-white mt-4 p-4 rounded-md"
                      required
                    />
                  </CardContent>
                  <CardContent>
                    <input
                      type="tel"
                      placeholder="Enter Your Mobile Number"
                      className="w-full bg-white mt-4 p-4 rounded-md"
                      pattern="[0-9]{10}"
                      required
                    />
                  </CardContent>
                </Card>
                <button
                  type="submit"
                  className="bg-[#00f0ff] text-black px-10 py-4 text-[18px] font-semibold hover:bg-white hover:text-black hover:border-black"
                >
                  Book Now
                </button>
              </form>
            </div>
            <button
              onClick={handleBack}
              className="bg-[#00f0ff] text-black px-12 py-4 text-[20px] font-semibold hover:bg-white hover:text-black hover:border-black mt-2"
            >
              Go Back
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-[40vh] md:h-screen relative order-1 md:order-2">
          <img
            src={Image2}
            alt="futsal"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
