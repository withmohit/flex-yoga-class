import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Users } from "lucide-react";
import { use } from "react";

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
  const [showResponse, setShowResponse] = useState(false); // ✅ Controls when to show response

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New Registration Submission
  const handleNewRegistration = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering user:", formData);
      await axios.post("http://127.0.0.1:8000/form/update", {...formData, age: parseInt(formData.age) });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Check Existing Member
  const handleMemberCheck = async (e) => {
    e.preventDefault();
    try {
        console.log("Checking membership for:", memberPhone);
        
        const response = await axios.get(`http://127.0.0.1:8000/form/query?phone=${memberPhone}`);
        setResponseData(response.data);
        setShowResponse(true); // ✅ Show response only after checking

        // Convert valid_till to Date for comparison
        const validTillDate = new Date(response.data.valid_till);
        console.log("Valid till:", validTillDate);

        if (validTillDate < new Date()) {
            setNeedForPayment(true);
        } else {
            setNeedForPayment(false);
        }
    } catch (error) {
        console.error("Error checking membership:", error);
        setShowResponse(false); // ✅ Hide response if there's an error
    }
};

// Ensure previous data is loaded only when `needForPayment` is true
useEffect(() => {
    if (needForPayment) {
        loadPreviousData();
    }
}, [needForPayment]);


  //fill response data into form
  const loadPreviousData = () => {
    setFormData({ ...formData, name: responseData.name, phone: memberPhone, age: responseData.age, gender: responseData.gender, batch_name: responseData.batch_name });
  };

  useEffect(() => {
    loadPreviousData();
  }, [needForPayment]);
  return (

    <div className="container">
      <div className="content">
        <h1 className="title">Zen Yoga Studio</h1>

        <div className="grid">
          {/* New Registration Form */}
          <div className="card">
            <div className="card-header">
              <UserPlus className="icon" />
              <h2 className="card-title">New Registration</h2>
            </div>

            <form onSubmit={handleNewRegistration} className="form">
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

              <button type="submit" className="button">Proceed to Payment</button>
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

              <button type="submit" className="button">Check My Plan</button>
            </form>

            {/* Show response only after checking */}
            {showResponse && (
              <div className="member-details">
                {responseData.name ? (
                  <>
                    <p>Hi, {responseData.name}</p>
                    {needForPayment ? (
                      <label className="label">Membership Expired on {responseData.validTill}. Please make a new payment.</label>
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
