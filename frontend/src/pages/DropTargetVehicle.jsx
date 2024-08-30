import React from 'react';
import { useDrop } from 'react-dnd';

const ItemType = 'ITEM';

const DropTargetVehicle = ({ vehicle, onDrop, onClick, children, currentItemCount }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => onDrop(item._id, vehicle._id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const remainingCapacity = vehicle.capacity - currentItemCount;

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm transition-all ${
        isOver ? 'bg-blue-100' : ''
      }`}
    >
      {children}
      <div className="p-2 text-sm">
        Remaining Capacity: {remainingCapacity} items
      </div>
    </div>
  );
};

export default DropTargetVehicle;