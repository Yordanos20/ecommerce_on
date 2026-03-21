import ProductCard from "../components/ProductCard";

export default function Home() {

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High quality sound",
      price: 99,
      image: "https://picsum.photos/300/200?1",
      isSale: true
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your health",
      price: 120,
      image: "https://picsum.photos/300/200?2"
    },
    {
      id: 3,
      name: "Gaming Mouse",
      description: "RGB lights",
      price: 45,
      image: "https://picsum.photos/300/200?3"
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      description: "Portable sound",
      price: 60,
      image: "https://picsum.photos/300/200?4"
    }
  ];

  const newArrivals = [
    {
      id: 5,
      name: "Laptop Backpack",
      description: "Waterproof",
      price: 35,
      image: "https://picsum.photos/300/200?5",
      isNew: true
    },
    {
      id: 6,
      name: "Wireless Keyboard",
      description: "Slim design",
      price: 55,
      image: "https://picsum.photos/300/200?6",
      isNew: true
    },
    {
      id: 7,
      name: "Phone Stand",
      description: "Adjustable",
      price: 15,
      image: "https://picsum.photos/300/200?7",
      isNew: true
    },
    {
      id: 8,
      name: "USB-C Hub",
      description: "Multiport",
      price: 40,
      image: "https://picsum.photos/300/200?8",
      isNew: true
    }
  ];

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">New Arrivals</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {newArrivals.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}