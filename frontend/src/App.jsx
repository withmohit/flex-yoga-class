import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Users } from "lucide-react";

function App() {
  // State for registration form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    batch_name: "",
  });

  // State for member verification
  const [responseData, setResponseData] = useState({});
  const [memberPhone, setMemberPhone] = useState("");
  const [needForPayment, setNeedForPayment] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // Loading states for buttons
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New Registration Submission
  const CompletePayment = async (e) => {
    e.preventDefault();
    setIsLoadingRegister(true); // Start loading
    try {
      console.log("Registering user:", formData);
      const response = await axios.post("http://127.0.0.1:8000/form/update", {
        ...formData,
        age: parseInt(formData.age),
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoadingRegister(false); // Stop loading
    }
  };

  // Check Existing Member
  const handleMemberCheck = async (e) => {
    e.preventDefault();
    setIsLoadingCheck(true); // Start loading
    try {
      console.log("Checking membership for:", memberPhone);
      const response = await axios.get(`http://127.0.0.1:8000/form/query?phone=${memberPhone}`);
      setResponseData(response.data);
      setShowResponse(true);

      const validTillDate = new Date(response.data.valid_till);
      console.log("Valid till:", validTillDate);

      if (validTillDate < new Date()) {
        setNeedForPayment(true);
      } else {
        setNeedForPayment(false);
      }
    } catch (error) {
      console.error("Error checking membership:", error);
      setShowResponse(false);
    } finally {
      setIsLoadingCheck(false); // Stop loading
    }
  };

  // Load previous data
  const loadPreviousData = async () => {
    setFormData({
      ...formData,
      name: responseData.name,
      age: responseData.age,
      phone: memberPhone,
      gender: responseData.gender,
    });
  };
  useEffect(() => {
    loadPreviousData();
  }, [needForPayment]);


  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Flex Yoga Studio</h1>

        <div className="grid">
          {/* New Registration Form */}
          <div className="card">
            <div className="card-header">
              <UserPlus className="icon" />
              <h2 className="card-title">{needForPayment?"Renew Your Membership":"New Registration"}</h2>
            </div>

            <form onSubmit={CompletePayment} className="form">
              <div className="form-group">
                <label className="label">Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input" />
              </div>

              <div className="form-group">
                <label className="label">Phone Number</label>
                <input type="tel" name="phone" required pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} className="input" placeholder="10 digit number" />
              </div>

              <div className="form-group">
                <label className="label">Age</label>
                <input type="number" name="age" required min="18" max="65" value={formData.age} onChange={handleChange} className="input" />
              </div>
              <div className="form-group">
                <label className="label">Gender</label>
                <select name="gender" required value={formData.gender} onChange={handleChange} className="select">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Batch</label>
                <select name="batch_name" required value={formData.batch_name} onChange={handleChange} className="select">
                  <option value="">Select batch</option>
                  <option value="6-7AM">6-7 AM</option>
                  <option value="7-8AM">7-8 AM</option>
                  <option value="8-9AM">8-9 AM</option>
                  <option value="5-6PM">5-6 PM</option>
                </select>
              </div>

              <button type="submit" className="button" disabled={isLoadingRegister}>
                {isLoadingRegister ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </div>

          {/* Member Verification Section */}
          <div className="card">
            <div className="card-header">
              <Users className="icon" />
              <h2 className="card-title">Already a Member?</h2>
            </div>

            <form onSubmit={handleMemberCheck} className="form">
              <div className="form-group">
                <label className="label">Phone Number</label>
                <input type="tel" required pattern="[0-9]{10}" value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} className="input" placeholder="Enter your registered phone number" />
              </div>

              <button type="submit" className="button" disabled={isLoadingCheck}>
                {isLoadingCheck ? "Processing..." : "Check My Plan"}
              </button>
            </form>

            {showResponse && (
              <div className="member-details">
                {responseData.name ? (
                  <>
                    <p>Hi, {responseData.name}</p>
                    {needForPayment ? (
                      <label className="label">Membership Expired on {responseData.valid_till}. Please make a new payment.</label>
                    ) : (
                      <>
                        {responseData.batch_name && <label className="label">Current Batch: {responseData.batch_name}</label>}
                        <br />
                        {responseData.valid_till && <label className="label">Valid Till: {responseData.valid_till}</label>}
                      </>
                    )}
                  </>
                ) : (
                  <p>No member found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
