"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { Spin } from "antd";
import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FStore } from "../../common/config/firebase/firebase.config";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface TFile {
    name: string;
    type: string;
}

interface TCategoryoption {
    jeans: string[];
    shirts: string[];
    t_shirts: string[];
    hoodies: string[];
    track_pants: string[];
    shorts: string[];
    perfumes: string[];
    undergarments: string[];
    socks: string[];
}

interface TFormData {
    file?: null,
    category: string,
    subcategory: string,
    title: string,
    description: string,
    price: string,
}

const AddProduct = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState<TFormData>({
        file: null,
        category: "jeans",
        subcategory: "",
        title: "",
        description: "",
        price: "",
    });
    const [newFile, setNewFile] = useState<TFile>({} as TFile);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const navigation = useNavigate();
    const [authData] = useState(() => {
        const storedUser = localStorage.getItem("auth");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    // const [authData, setAuthData] = useState(JSON.parse(localStorage.getItem("auth")));  // Initialize empty

    const categoryOptions: TCategoryoption = {
        jeans: ["straight_fit", "slim_fit", "bootcut"],
        shirts: ["casual", "formal"],
        t_shirts: ["round_neck", "v_neck", "polo"],
        hoodies: ["zipped", "pullover"],
        track_pants: ["joggers", "sweatpants"],
        shorts: ["sport_shorts", "casual_shorts"],
        perfumes: ["floral", "woody", "citrus"],
        undergarments: ["briefs", "boxers", "thermal"],
        socks: ["ankle", "crew", "knee_high"],
    };


    useEffect(() => {
        checkAdminRole()
    }, [authData, categoryOptions, navigation]);

    const checkAdminRole = async () => {
        if (authData) {
            const userDoc = await getDoc(doc(FStore, "users", authData.uid as string));
            const userData = userDoc.data();

            if (userData?.role === "admin") {
                setIsAdmin(true);
                setSubcategories(categoryOptions["jeans"]);
            } else {
                navigation("/");  // Redirect non-admins to the homepage
            }
        } else {
            navigation("/auth/login");  // Redirect to login if not authenticated
        }
        setLoading(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "category") {
            const categoryValue = value as keyof TCategoryoption;
            setSubcategories(categoryOptions[categoryValue] || []);
            setFormData((prevData) => ({
                ...prevData,
                category: value,
                subcategory: "",
            }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files && e.target.files[0];
        setNewFile(files ?? {} as TFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let fileURL = "";
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${formData.category}/${newFile.name}`);
            const metaData = { contentType: newFile.type as string };
            await uploadBytes(storageRef, newFile as File, metaData);
            fileURL = await getDownloadURL(storageRef);

            const productData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                file: { url: fileURL, name: newFile.name, type: newFile.type },
                subcategory: formData.subcategory,
                createdAt: new Date(),
            };

            const categoryCollectionRef = collection(FStore, formData.category);
            await addDoc(categoryCollectionRef, productData);

            alert("Product added successfully to the " + formData.category + " collection!");
            setLoading(false);

            setFormData({
                file: null,
                category: "jeans",
                subcategory: "",
                title: "",
                description: "",
                price: "",
            });
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <Spin className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 text-white" spinning={loading}>
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-4">
                    <ArrowLeftOutlined
                        className="text-2xl cursor-pointer hover:text-blue-600 transition duration-300"
                        onClick={() => navigation("/admin")}
                    />
                    <h2 className="text-3xl font-bold">Add Products</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Upload File</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="block w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            required
                            name="file"
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            required
                        >
                            <option value="jeans">Jeans</option>
                            <option value="shirts">Shirts</option>
                            <option value="t_shirts">T-shirts</option>
                            <option value="hoodies">Hoodies</option>
                            <option value="track_pants">Track Pants</option>
                            <option value="shorts">Shorts</option>
                            <option value="perfumes">Perfumes</option> {/* Added Perfume category */}
                            <option value="undergarments">Undergarments</option> {/* Added Undergarments category */}
                            <option value="socks">Socks</option> {/* Added Socks category */}
                        </select>
                    </div>

                    {/* Subcategory Selection */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Subcategory</label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            required
                        >
                            {subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory}>
                                    {subcategory}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="block w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            placeholder="Enter the title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="block w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            placeholder="Enter the description"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <label className="text-white block text-lg font-semibold mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="block w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none"
                            placeholder="Enter the price"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-semibold hover:scale-105 transform transition duration-300"
                    >
                        Add Product
                    </button>
                </form>


            </div>
        </Spin>
    );
};

export default AddProduct;
