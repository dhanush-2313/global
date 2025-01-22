import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import the CSS file for styling

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:3000/check-session", {
          withCredentials: true,
        });
        if (!response.data.session) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying session", error);
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const products = [
    {
      id: 1,
      name: "Zebronics MAX FURY Transparent RGB LED Illuminated Wired Gamepad",
      price: 100,
      image: "https://m.media-amazon.com/images/I/51Kumm2y2mL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      id: 2,
      name: "EvoFox Blaze Programmable Gaming Mouse",
      price: 200,
      image: "https://m.media-amazon.com/images/I/41MwUWdUZ8L._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      id: 3,
      name: "WAR HAMMER Gaming Mouse Pad (DragonFire)",
      price: 100,
      image: "https://m.media-amazon.com/images/I/41bZQ1GTauL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      id: 4,
      name: "ZEBRONICS Optimu39.99s Gaming Keyboard & Mouse Combo",
      price: 100,
      image: "https://m.media-amazon.com/images/I/41sZmWcNNKL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      id: 5,
      name: "ZEBRONICS Havoc Premium Gaming Over Ear Headphone with Dolby Atmos Subscription",
      price: 200,
      image: "https://m.media-amazon.com/images/I/71YjS4nfPVL._SL1500_.jpg",
    },
    {
      id: 6,
      name: "Ant Esports Elite 1100 Mid-Tower Computer Case/Gaming Cabinet",
      price: 100,
      image: "https://m.media-amazon.com/images/I/41dtRPYZIAL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      id: 7,
      name: "Sony PS4 Slim 500 GB Console",
      price: 100,
      image: "https://m.media-amazon.com/images/I/41w32g06cSL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      id: 8,
      name: "Sony PlayStation®5 Console (slim)",
      price: 100,
      image: "https://m.media-amazon.com/images/I/41b-EDZt7dL._SX300_SY300_QL70_FMwebp_.jpg",
    },
  ];

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="navbar-title">Home</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price}</p>
            <button className="buy-button">Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
