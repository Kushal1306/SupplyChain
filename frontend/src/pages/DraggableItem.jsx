import React from 'react';
import { useDrag } from 'react-dnd';
import { Package, DollarSign, Weight } from 'lucide-react';

const ItemType = 'ITEM';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border rounded-lg shadow-sm transition-all
        ${item.assignedStatus ? 'bg-green-100 border-green-300' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1.2 }}
    >
      <p className="font-semibold text-lg mb-2 flex items-center">
        <Package className="mr-2 text-blue-500" /> {item.itemName}
      </p>
      <p className="text-gray-600 flex items-center">
        <DollarSign className="mr-2 text-green-500" /> ${item.itemValue}
      </p>
      <p className="text-gray-600 flex items-center">
        <Weight className="mr-2 text-yellow-500" /> {item.weight} kg
      </p>
      {item.assignedStatus && (
        <p className="text-green-600 mt-2 font-semibold">Assigned</p>
      )}
    </div>
  );
};

export default DraggableItem;