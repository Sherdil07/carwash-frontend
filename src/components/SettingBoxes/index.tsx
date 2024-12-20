"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Service {
  _id: string;
  carType: string;
  serviceName: string;
  price: number;
}

const SettingsForm = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [carType, setCarType] = useState<string>("Sedan");
  const [newServiceName, setNewServiceName] = useState<string>("");
  const [newServicePrice, setNewServicePrice] = useState<number>(0);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get<Service[]>(
        "https://carwash-backend-eight.vercel.app/api/services",
      );
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error("Failed to fetch services.");
    }
  };

  const handleServiceChange = async (
    id: string,
    field: string,
    value: number,
  ) => {
    const updatedServices = services.map((service) =>
      service._id === id ? { ...service, [field]: value } : service,
    );
    setServices(updatedServices);

    try {
      await axios.put(
        `https://carwash-backend-eight.vercel.app/api/services`,
        { id, price: value }, // Adjusted to match your backend structure
      );
      toast.success("Service price updated successfully!");
    } catch (error) {
      console.error("Failed to update service price:", error);
      toast.error("Failed to update service price.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newServiceName || newServicePrice <= 0) return;

    try {
      await axios.post(
        "https://carwash-backend-eight.vercel.app/api/services",
        { carType, serviceName: newServiceName, price: newServicePrice },
      );
      fetchServices(); // Refresh services after adding
      setNewServiceName(""); // Clear input fields
      setNewServicePrice(0);
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error("Failed to add service.");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await axios.delete(
        `https://carwash-backend-eight.vercel.app/api/services/${id}`,
      );
      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service.");
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Update Service Prices
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Car Type:</label>
          <select value={carType} onChange={(e) => setCarType(e.target.value)}>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Hatchback">Hatchback</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Service Name"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newServicePrice}
            onChange={(e) => setNewServicePrice(Number(e.target.value))}
            required
          />
          <button type="submit">Add Service</button>
        </div>
      </form>
      <ul>
        {services
          .filter((service) => service.carType === carType)
          .map((service) => (
            <li key={service._id}>
              <span>
                {service.serviceName}: ${service.price}
              </span>
              <input
                type="number"
                value={service.price}
                onChange={(e) =>
                  handleServiceChange(
                    service._id,
                    "price",
                    Number(e.target.value),
                  )
                }
              />
              <button onClick={() => handleDeleteService(service._id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SettingsForm;
