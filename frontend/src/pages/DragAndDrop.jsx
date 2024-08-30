import React, { useState, useEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import axios from 'axios';
import { Users, Truck, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DraggableItem from './DraggableItem';
import DropTargetVehicle from './DropTargetVehicle';

const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: currentOffset.x,
      top: currentOffset.y,
    }}>
      <DraggableItem item={item} />
    </div>
  );
};

const DragAndDrop = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [expandedVehicle, setExpandedVehicle] = useState(null);
  const [vehicleItems, setVehicleItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, itemsResponse, vehiclesResponse] = await Promise.all([
          axios.get('http://localhost:3000/user/'),
          axios.get('http://localhost:3000/items/all'),
          axios.get('http://localhost:3000/vehicle/')
        ]);
        setUsers(usersResponse.data.users);
        setItems(itemsResponse.data.items);
        setVehicles(vehiclesResponse.data.vehicles);

        // Fetch items for all vehicles
        const allVehicleItems = {};
        for (const vehicle of vehiclesResponse.data.vehicles) {
          const response = await axios.get(`http://localhost:3000/vehicle/${vehicle._id}/items`);
          allVehicleItems[vehicle._id] = response.data.items;
        }
        setVehicleItems(allVehicleItems);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleDrop = async (itemId, vehicleId) => {
    try {
      const vehicle = vehicles.find(v => v._id === vehicleId);
      const item = items.find(i => i._id === itemId);
      
      if (!vehicle || !item) {
        throw new Error('Vehicle or item not found');
      }

      const currentItemCount = (vehicleItems[vehicleId] || []).length;

      if (currentItemCount >= vehicle.capacity) {
        toast.error(`Cannot add item. Vehicle ${vehicle.vehicleNumber} is at full capacity (${vehicle.capacity} items).`);
        return;
      }

      await axios.post('http://localhost:3000/assignment/', { itemId, vehicleId });
      
      setItems(prevItems => prevItems.map(i => 
        i._id === itemId ? { ...i, assignedStatus: true } : i
      ));
      
      // Update vehicleItems state
      setVehicleItems(prevVehicleItems => ({
        ...prevVehicleItems,
        [vehicleId]: [...(prevVehicleItems[vehicleId] || []), item]
      }));

      if (currentItemCount + 1 === vehicle.capacity) {
        toast.success(`Vehicle ${vehicle.vehicleNumber} is now full!`);
      } else {
        toast.success(`Item assigned to vehicle ${vehicle.vehicleNumber}`);
      }
    } catch (error) {
      console.error('Error assigning item:', error);
      toast.error('Failed to assign item to vehicle');
    }
  };

  const toggleUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const toggleVehicle = (vehicleId) => {
    setExpandedVehicle(expandedVehicle === vehicleId ? null : vehicleId);
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Left Side - Users and Items */}
        <div className="w-1/2 p-4 bg-white shadow-md overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Users className="mr-2" /> Users and Items
          </h2>
          <ul className="space-y-4">
            {users.map(user => (
              <li key={user._id} className="border rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleUser(user._id)}
                >
                  <span className="font-semibold">{user.name}</span>
                  {expandedUser === user._id ? <ChevronUp /> : <ChevronDown />}
                </div>
                {expandedUser === user._id && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items
                      .filter(item => item.userId === user._id)
                      .map(item => (
                        <DraggableItem key={item._id} item={item} />
                      ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Vehicles */}
        <div className="w-1/2 p-4 bg-gray-200 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Truck className="mr-2" /> Vehicles
          </h2>
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-sm">
                <DropTargetVehicle
                  vehicle={vehicle}
                  onDrop={handleDrop}
                  onClick={() => toggleVehicle(vehicle._id)}
                  currentItemCount={(vehicleItems[vehicle._id] || []).length}
                >
                  <div className="flex justify-between items-center p-4 cursor-pointer">
                    <span className="font-semibold">{vehicle.vehicleNumber}</span>
                    {expandedVehicle === vehicle._id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </DropTargetVehicle>
                {expandedVehicle === vehicle._id && (
                  <div className="p-4 border-t">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Package className="mr-2" /> Assigned Items
                    </h3>
                    {vehicleItems[vehicle._id] && vehicleItems[vehicle._id].length > 0 ? (
                      <ul className="space-y-2">
                        {vehicleItems[vehicle._id].map(item => (
                          <li key={item._id} className="flex items-center">
                            <Package className="mr-2 text-blue-500" />
                            {item.itemName} - ${item.itemValue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No items assigned to this vehicle.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CustomDragLayer />
    </>
  );
};

export default DragAndDrop;