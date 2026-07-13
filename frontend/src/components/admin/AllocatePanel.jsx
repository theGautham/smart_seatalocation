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
// SUB-COMPONENT: SEAT ALLOCATION WIZARD
// =========================================================================
const AllocatePanel = ({ setActiveTab, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [dbGroups, setDbGroups] = useState([]);
  const [dbClassrooms, setDbClassrooms] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [selectedGroupKey, setSelectedGroupKey] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (dbGroups.length > 0) {
      setSelectedGroupKey(`${dbGroups[0].department}-${dbGroups[0].semester}`);
    } else {
      setSelectedGroupKey('');
    }
  }, [dbGroups]);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const groupsRes = await axios.get('/allocations/metadata/groups');
      setDbGroups(groupsRes.data);

      const roomsRes = await axios.get('/classrooms?available=true');
      setDbClassrooms(roomsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch allocation records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    if (!selectedGroupKey) {
      setError('No student groups available to allocate.');
      return;
    }
    const [dept, sem] = selectedGroupKey.split('-');
    const exists = selectedGroups.some(g => g.department === dept && g.semester === sem);
    if (exists) {
      setError(`Group ${dept} ${sem} is already added`);
      return;
    }
    setError(null);
    setSelectedGroups([...selectedGroups, { department: dept, semester: sem }]);
  };

  const handleRemoveGroup = (idx) => {
    setSelectedGroups(selectedGroups.filter((_, i) => i !== idx));
  };

  const handleToggleRoom = (roomNum) => {
    if (selectedRooms.includes(roomNum)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomNum));
    } else {
      setSelectedRooms([...selectedRooms, roomNum]);
    }
  };

  const getGroupStudentCount = (dept, sem) => {
    const match = dbGroups.find(g => g.department === dept && g.semester === sem);
    return match ? match.count : 0;
  };

  const totalStudents = selectedGroups.reduce((sum, g) => sum + getGroupStudentCount(g.department, g.semester), 0);
  const getRoomCapacity = (roomNum) => {
    const match = dbClassrooms.find(r => r.roomNumber === roomNum);
    return match ? match.capacity : 0;
  };
  const totalCapacity = selectedRooms.reduce((sum, r) => sum + getRoomCapacity(r), 0);

  const isCapacityInsufficient = totalCapacity < totalStudents && totalStudents > 0;
  const availableAfterAllocation = Math.max(0, totalCapacity - totalStudents);

  const handleGenerateAllocation = async () => {
    if (selectedGroups.length === 0 || selectedRooms.length === 0) {
      setError('Select student groups and classrooms');
      return;
    }
    if (isCapacityInsufficient) {
      setError('Insufficient seat capacity');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await axios.post('/allocations/generate', {
        groups: selectedGroups,
        classrooms: selectedRooms
      });
      setSuccess(true);
      onRefresh(); // Refresh parent metrics state
      setTimeout(() => {
        setActiveTab('view-allocations');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred generating allocations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-800/60 pb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Seat Allocation Wizard</h2>
        <p className="text-slate-400 text-sm mt-1">Configure student groups, select exam halls, check capacity limits, and generate seat assignments.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-pulse">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>Seats successfully allocated! Redirecting to allocation grid...</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 1</span>
            <h3 className="font-bold text-slate-200 text-sm">Select Student Groups</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Groups</label>
              <div className="relative">
                <select
                  value={selectedGroupKey}
                  onChange={(e) => setSelectedGroupKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                >
                  {dbGroups.length === 0 ? (
                    <option value="">No unallocated student groups</option>
                  ) : (
                    dbGroups.map(g => (
                      <option key={`${g.department}-${g.semester}`} value={`${g.department}-${g.semester}`}>
                        {g.department} {g.semester} ({g.count} students)
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-3 text-slate-505 pointer-events-none" size={14} />
              </div>
            </div>
            <button
              onClick={handleAddGroup}
              disabled={dbGroups.length === 0}
              className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-705 text-slate-200 py-2.5 rounded-xl text-xs font-bold border border-slate-705 disabled:opacity-40 transition-all"
            >
              <Plus size={14} />
              <span>Add Group</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Group List</h4>
            {selectedGroups.length === 0 ? (
              <p className="text-[10px] text-slate-650 bg-slate-950/40 p-4 rounded-xl border border-slate-900 border-dashed text-center">No student groups selected.</p>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {selectedGroups.map((g, i) => {
                  const count = getGroupStudentCount(g.department, g.semester);
                  return (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-850">
                      <span className="text-xs font-bold text-slate-250 uppercase">{g.department} • {g.semester} <span className="font-normal text-slate-505">({count} students)</span></span>
                      <button onClick={() => handleRemoveGroup(i)} className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-850 rounded-lg"><Trash2 size={12} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
            <span className="bg-indigo-650 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 2</span>
            <h3 className="font-bold text-slate-200 text-sm">Select Classrooms</h3>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Available Classrooms</label>
            {dbClassrooms.length === 0 ? (
              <p className="text-[10px] text-slate-600 text-center py-6">No classrooms available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {dbClassrooms.map((room) => {
                  const isChecked = selectedRooms.includes(room.roomNumber);
                  return (
                    <label
                      key={room._id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked ? 'bg-indigo-650/10 border-indigo-500 text-slate-200' : 'bg-slate-950/40 border-slate-855 text-slate-450 hover:bg-slate-900/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRoom(room.roomNumber)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{room.roomNumber}</span>
                        <span className="text-[9px] text-slate-505 font-bold">{room.capacity} seats</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
              <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 3</span>
              <h3 className="font-bold text-slate-200 text-sm">Allocation Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Students</span>
                <span className="text-sm font-bold text-white">{totalStudents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Allocated Capacity</span>
                <span className="text-sm font-bold text-white">{totalCapacity}</span>
              </div>

              {isCapacityInsufficient ? (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-300 flex items-start gap-2">
                  <AlertCircle className="shrink-0 text-red-400 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Insufficient Capacity</h5>
                    <p className="text-[10px] text-red-400/90 mt-0.5">Please check more classrooms. You need {totalStudents} seats but only have {totalCapacity}.</p>
                  </div>
                </div>
              ) : totalStudents > 0 && selectedRooms.length > 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="shrink-0 text-emerald-450 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Capacity Validated</h5>
                    <p className="text-[10px] text-emerald-400/90 mt-0.5">Seats are sufficient! {availableAfterAllocation} seats will remain vacant.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl text-slate-500 flex items-start gap-2">
                  <Info className="shrink-0 text-slate-500 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs text-slate-400">Prerequisites</h5>
                    <p className="text-[10px] text-slate-505 mt-0.5">Select student groups and check rooms to begin calculations.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerateAllocation}
            disabled={loading || selectedGroups.length === 0 || selectedRooms.length === 0 || isCapacityInsufficient}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white py-3.5 rounded-xl text-xs font-semibold shadow-md disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Cpu size={14} />
                <span>Generate Seat Allocation</span>
                <ChevronRight size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export default AllocatePanel;
