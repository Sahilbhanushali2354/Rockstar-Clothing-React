import { ChangeEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { Spin, Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, FStore } from "../common/config/firebase/firebase.config";
import "../steps.css"; // Import custom styles

const { Step } = Steps;

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number.";
        }
        if (!formData.address) newErrors.address = "Address is required.";
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        return newErrors;
    };

    const checkEmailExists = async (email: string) => {
        const usersRef = collection(FStore, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSubmit = async () => {
        debugger
        setLoading(true);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            console.log(validationErrors)
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                setErrors({ email: "User already exists with this email." });
                setLoading(false);
                return;
            }

            const { user } = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await setDoc(doc(FStore, "users", user.uid), {
                uid: user.uid,
                role: 'user',
                ...formData,
            });

            message.success("Signup successful! Redirecting to login...");
            localStorage.setItem("auth", JSON.stringify(formData));

            navigate("/auth/login");
        } catch (error) {
            setErrors({ email: error as string });
            setLoading(false);
        }
    };

    const next = () => setCurrentStep((prev) => prev + 1);
    const prev = () => setCurrentStep((prev) => prev - 1);

    return (
        <Spin spinning={loading} className="bg-gray-900 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-3xl shadow-lg">
                <h2 className="text-3xl text-cyan-300 font-bold text-center mb-6">Create Your Account</h2>

                <Steps current={currentStep} className="mb-8 custom-steps">
                    <Step title={<span className={currentStep >= 0 ? "active-step" : ""}>Personal Info</span>} />
                    <Step title={<span className={currentStep >= 1 ? "active-step" : ""}>Contact Info</span>} />
                    <Step title={<span className={currentStep === 2 ? "active-step" : ""}>Security</span>} />
                </Steps>

                <div className="space-y-4">
                    {currentStep === 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                            />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                            />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600"
                        />
                    )}

                    <div className="flex justify-between mt-6">
                        {currentStep > 0 && (
                            <Button onClick={prev} className="bg-gray-600 text-white">
                                Previous
                            </Button>
                        )}
                        {currentStep < 2 ? (
                            <Button onClick={next} className="bg-blue-600 text-white">
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-green-600 text-white">
                                Sign Up
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Signup;
