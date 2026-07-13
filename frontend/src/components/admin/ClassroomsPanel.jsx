import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  School, 
  UserCheck, 
  CheckCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  RefreshCw, 
  Cpu, 
  Info
} from 'lucide-react';

// =========================================================================
// SUB-COMPONENT: CLASSROOM MANAGEMENT
// =========================================================================
const ClassroomsPanel = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [benches, setBenches] = useState(15);
  const [seatsPerBench, setSeatsPerBench] = useState(2);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/classrooms');
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch classroom listings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber || !building || !floor) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.post('/classrooms', {
        roomNumber, building, floor,
        benches: Number(benches),
        seatsPerBench: Number(seatsPerBench)
      });
      setRoomNumber('');
      setBuilding('');
      setFloor('');
      setBenches(15);
      setSeatsPerBench(2);
      setIsAddModalOpen(false);
      setSuccessMsg('Classroom added successfully!');
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add classroom');
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!currentRoom.roomNumber || !currentRoom.building || !currentRoom.floor) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.put(`/classrooms/${currentRoom._id}`, {
        roomNumber: currentRoom.roomNumber,
        building: currentRoom.building,
        floor: currentRoom.floor,
        benches: Number(currentRoom.benches),
        seatsPerBench: Number(currentRoom.seatsPerBench)
      });
      setIsEditModalOpen(false);
      setCurrentRoom(null);
      setSuccessMsg('Classroom details updated successfully!');
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update classroom');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete classroom? This clears seat and teacher assignments for this room.')) return;
    try {
      await axios.delete(`/classrooms/${id}`);
      setSuccessMsg('Classroom deleted successfully');
      fetchClassrooms();
    } catch (err) {
      console.error(err);
      setError('Failed to delete classroom');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Classroom Management</h2>
          <p className="text-slate-400 text-sm mt-1">Configure exam halls, building locations, and seat capacities.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add Classroom</span>
        </button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {loading && classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs">Querying classrooms...</span>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
            <School size={32} className="text-slate-850" />
            <p className="text-xs">No examination classrooms configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Room</th>
                  <th className="px-6 py-3.5">Building</th>
                  <th className="px-6 py-3.5">Floor</th>
                  <th className="px-6 py-3.5">Benches</th>
                  <th className="px-6 py-3.5">Seats/Bench</th>
                  <th className="px-6 py-3.5">Capacity</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs text-slate-300">
                {classrooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-indigo-400">{room.roomNumber}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{room.building}</td>
                    <td className="px-6 py-3.5">{room.floor}</td>
                    <td className="px-6 py-3.5">{room.benches}</td>
                    <td className="px-6 py-3.5">{room.seatsPerBench}</td>
                    <td className="px-6 py-3.5 font-bold text-emerald-400">{room.capacity} seats</td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setCurrentRoom(room);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-300 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Add Classroom</h3>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Building</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Floor</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Benches Count</label>
                  <input
                    type="number"
                    min="1"
                    value={benches}
                    onChange={(e) => setBenches(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Seats / Bench</label>
                  <input
                    type="number"
                    min="1"
                    value={seatsPerBench}
                    onChange={(e) => setSeatsPerBench(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Total Capacity:</span>
                <span className="font-bold text-emerald-400">{benches * seatsPerBench || 0} Seats</span>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Create Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Edit Classroom</h3>
            <form onSubmit={handleEditRoom} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Room Number</label>
                <input
                  type="text"
                  value={currentRoom.roomNumber}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, roomNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Building</label>
                  <input
                    type="text"
                    value={currentRoom.building}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, building: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Floor</label>
                  <input
                    type="text"
                    value={currentRoom.floor}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, floor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Benches</label>
                  <input
                    type="number"
                    min="1"
                    value={currentRoom.benches}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, benches: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Seats Per Bench</label>
                  <input
                    type="number"
                    min="1"
                    value={currentRoom.seatsPerBench}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, seatsPerBench: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-505 font-medium">Calculated Capacity:</span>
                <span className="font-bold text-emerald-450">{currentRoom.benches * currentRoom.seatsPerBench || 0} Seats</span>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ClassroomsPanel;
