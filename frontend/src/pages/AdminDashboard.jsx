import React from 'react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragAndDrop from './DragAndDrop';

const AdminDashboard = () => {
  return (
    <DndProvider backend={HTML5Backend}>
    <DragAndDrop/>
  </DndProvider>
    
  )
}

export default AdminDashboard;
