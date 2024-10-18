import { Spin, Carousel } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../common/config/firebase/firebase.config";

const Dashboard = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const [showCarousel, setShowCarousel] = useState<boolean>(false);
    const navigate = useNavigate()
    useEffect(() => {
        const x = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/auth/login");
            }
        });

        return () => x();
    }, [navigate]);


    const carouselItems = [
        { type: "image", src: "/images/jeans/1.jpg", alt: "Jeans" },
        { type: "image", src: "/images/sport-tshirt/1.jpg", alt: "Sport T-shirt" },
        { type: "image", src: "/images/sport-trouser/1.jpg", alt: "Sport Trouser" },
        { type: "video", src: "/videos/formal_pent.mp4", alt: "Fashion Video" },
        { type: "image", src: "/images/sport-shorts/1.jpg", alt: "Sport Shorts" },
        { type: "image", src: "/images/perfumes/1.jpg", alt: "Perfume" },
        { type: "image", src: "/images/formal-socks/1.jpg", alt: "Socks" },
    ];

    // Trigger showing the carousel after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowCarousel(true), 5000);
        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);

    return (
        <Spin spinning={loader} className="w-full min-h-screen text-cyan-200">
            {showCarousel ? (
                <Carousel autoplay effect="fade" className="mb-10">
                    {carouselItems.map((item, index) => (
                        <div key={index}>
                            {item.type === "image" ? (
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-[400px] object-cover"
                                />
                            ) : (
                                <video
                                    src={item.src}
                                    controls
                                    className="w-full h-[400px] object-cover"
                                />
                            )}
                        </div>
                    ))}
                </Carousel>
            ) : (
                <section className="relative py-20 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-down">
                            Discover the Rockstar Collection
                        </h1>
                        <p className="text-xl lg:text-2xl mb-10 font-light">
                            Elevate your style with our exclusive range of mens clothing.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-cyan-200 py-3 px-8 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                        >
                            Shop Now
                        </Link>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="py-20 px-5 max-w-[1280px] mx-auto">
                <h2 className="text-4xl font-bold text-center mb-10 animate-fade-in-up">
                    Our Featured Collection
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    <Link to="/category/jeans" onClick={() => setLoader(true)}>
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/jeans/1.jpg"
                                alt="Jeans"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Stylish Jeans</h3>
                        </div>
                    </Link>

                    <Link to="/category/t_shirts">
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/sport-tshirt/1.jpg"
                                alt="T-shirts"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Sport T-shirt</h3>
                        </div>
                    </Link>

                    <Link to="/category/track-pants">
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/sport-trouser/1.jpg"
                                alt="Trousers"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Sport Trousers</h3>
                        </div>
                    </Link>

                    <Link to="/category/shorts">
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/sport-shorts/1.jpg"
                                alt="Shorts"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Sport Shorts</h3>
                        </div>
                    </Link>

                    <Link to="/category/perfumes">
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/perfumes/1.jpg"
                                alt="Perfumes"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Perfumes</h3>
                        </div>
                    </Link>

                    <Link to="/category/socks">
                        <div className="group bg-gray-900 p-6 rounded-xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                            <img
                                width={500}
                                height={500}
                                src="/images/formal-socks/1.jpg"
                                alt="Socks"
                                className="rounded-lg mb-4 group-hover:opacity-90 transition-opacity duration-300 w-full h-auto"
                            />
                            <h3 className="text-cyan-200 text-xl font-semibold mb-2">Socks</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </Spin>
    );
};

export default Dashboard;
