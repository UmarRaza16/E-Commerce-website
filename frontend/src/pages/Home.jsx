import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    const res = await api.get(
      `/products?search=${search}&category=${category}`
    );
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const res = await api.post(`/cart/add`, { userId, productId });

    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };


 
  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-900 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border border-gray-300 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobile">Mobile</option>
          <option value="Footwear">Footwear</option>
           <option value="Fashion">Fashion</option>
          
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <Link 
          
            key={product._id}
            to = {`/product/${product._id}`}
            className="border p-3 rounded shadow hover:shadow-lg transition"
          >
          
  
        
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-600">{product.price}</p>
 <button 
 className='mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded haveover:bg-blue-600 transition'>Add to Cart</button>

            </Link>
            

        ))}

        
      </div>
      
    </div>
    
  );
}