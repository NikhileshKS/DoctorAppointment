import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";  

const AddDoctor = () => {

    const [docImg, setDocImg] = React.useState(false); 
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [experience, setExperience] = React.useState('1 Year');
    const [fees, setFees] = React.useState('');
    const [speciality, setSpeciality] = React.useState('General Physician');
    const [degree, setDegree] = React.useState('');
    const [address1, setAddress1] = React.useState('');
    const [address2, setAddress2] = React.useState('');
    const [about, setAbout] = React.useState('');

    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error("Image not uploaded");
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', parseInt(experience));
            formData.append('fees', Number(fees));
            formData.append('specialization', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
            formData.append('about', about);

            // ✅ Fixed — lowercase atoken as header key
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {
                headers: { atoken: aToken }
            });

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setEmail('');
                setPassword('');
                setFees('');
                setDegree('');
                setAddress1('');
                setAddress2('');
                setAbout('');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>

            <div className="flex items-center gap-4 mb-4 text-gray-600">
                <label htmlFor="doc-img" className="relative group cursor-pointer">
                    <img
                        className="w-16 h-16 bg-gray-100 rounded-full object-cover transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-700 group-hover:brightness-90"
                        src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                        alt="upload"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-[10px] shadow-md">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </span>
                </label>
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                <p>Upload doctor picture</p>
            </div>

            <div className="bg-white px-8 py-8 border w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex flex-col gap-10 text-gray-600">
                    <div className="flex flex-col lg:flex-row items-start gap-10">

                        {/* Left Column */}
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p>Your Name</p>
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Doctor Email</p>
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Password</p>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Experience</p>
                                <select 
                                    name="experience" 
                                    id="experience" 
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="1 Year">1 year</option>
                                    <option value="2 Year">2 year</option>
                                    <option value="3 Year">3 year</option>
                                    <option value="4 Year">4 year</option>
                                    <option value="5 Year">5 year</option>
                                    <option value="6 Year">6 year</option>
                                    <option value="7 Year">7 year</option>
                                    <option value="8 Year">8 year</option>
                                    <option value="9 Year">9 year</option>
                                    <option value="10 Year">10 year</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Fees</p>
                                <input 
                                    type="number" 
                                    placeholder="Fees" 
                                    value={fees}
                                    onChange={(e) => setFees(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p>Speciality</p>
                                <select 
                                    name="speciality" 
                                    id="speciality" 
                                    value={speciality}
                                    onChange={(e) => setSpeciality(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="General Physician">General Physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatricians">Pediatricians</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Education</p>
                                <input 
                                    type="text" 
                                    placeholder="Education" 
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Address</p>
                                <input 
                                    type="text" 
                                    placeholder="Address 1" 
                                    value={address1}
                                    onChange={(e) => setAddress1(e.target.value)}
                                    required 
                                    className="border rounded p-2 mb-2" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Address 2" 
                                    value={address2}
                                    onChange={(e) => setAddress2(e.target.value)}
                                    required 
                                    className="border rounded p-2" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Doctor section */}
                    <div className="flex flex-col gap-1 w-full">
                        <p>About Doctor</p>
                        <textarea 
                            placeholder="About Doctor" 
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={5} 
                            required 
                            className="border rounded p-2"
                        ></textarea>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4">
                        Add Doctor
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddDoctor;