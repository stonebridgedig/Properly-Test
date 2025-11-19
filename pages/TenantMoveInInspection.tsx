
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TENANT_NAV } from '../constants';
import { UploadIcon, XMarkIcon, CheckCircleIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon, Bars3Icon } from '../components/Icons';
import type { Condition, InspectionPhoto, InspectionRoomState, InspectionState, InspectionDraft } from '../types';

const INSPECTION_DRAFT_KEY = 'properly-inspection-draft';

const AddRoomModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (roomName: string) => void;
}> = ({ isOpen, onClose, onAdd }) => {
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRoomName('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(roomName);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Add a Room</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6">
                        <label htmlFor="roomName" className="block text-sm font-medium text-slate-700">Room Name</label>
                        <input
                            id="roomName"
                            type="text"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                            placeholder="e.g., Balcony"
                        />
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Room</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const RoomInspectionSection: React.FC<{
    roomName: string;
    roomState: InspectionRoomState;
    onUpdate: (roomName: string, updatedState: InspectionRoomState) => void;
}> = ({ roomName, roomState, onUpdate }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newPhoto: InspectionPhoto = {
                        id: Date.now() + Math.random(),
                        preview: reader.result as string
                    };
                    onUpdate(roomName, { ...roomState, photos: [...roomState.photos, newPhoto] });
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (photoId: number) => {
        onUpdate(roomName, { ...roomState, photos: roomState.photos.filter(p => p.id !== photoId) });
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Overall Condition</label>
                <div className="flex space-x-4">
                    {(['Good', 'Fair', 'Damaged'] as Condition[]).map(condition => (
                        <button
                            key={condition}
                            type="button"
                            onClick={() => onUpdate(roomName, { ...roomState, condition })}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${roomState.condition === condition ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {condition}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor={`notes-${roomName}`} className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                    id={`notes-${roomName}`}
                    value={roomState.notes}
                    onChange={e => onUpdate(roomName, { ...roomState, notes: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                    placeholder="e.g., Scuff marks on the wall, carpet stain near the window..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Photos</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                    <div className="text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-slate-300" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600">
                            <label htmlFor={`file-upload-${roomName}`} className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
                                <span>Upload files</span>
                                <input id={`file-upload-${roomName}`} type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                 {roomState.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {roomState.photos.map(photo => (
                            <div key={photo.id} className="relative group">
                                <img src={photo.preview} alt="Inspection" className="w-full h-24 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(photo.id)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const SubmittedView: React.FC<{ onRevise: () => void }> = ({ onRevise }) => (
    <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
       <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
       <h2 className="mt-4 text-3xl font-bold text-slate-800">Inspection Submitted!</h2>
       <p className="mt-2 text-slate-600">Thank you. Your move-in inspection report has been sent to the property manager.</p>
        <button onClick={onRevise} className="mt-8 px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
           Revise Report
       </button>
    </div>
);

const TenantMoveInInspection: React.FC = () => {
    const defaultRooms = ['Entry', 'Living Room', 'Kitchen', 'Bedroom 1', 'Bathroom 1'];
    
    const [rooms, setRooms] = useState<string[]>(defaultRooms);
    const [inspectionData, setInspectionData] = useState<InspectionState>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const draft = localStorage.getItem(INSPECTION_DRAFT_KEY);
        if (draft) {
            setShowResumePrompt(true);
        } else {
             initializeInspection(defaultRooms);
        }
    }, []);

    const initializeInspection = (initialRooms: string[]) => {
        setRooms(initialRooms);
        setInspectionData(initialRooms.reduce((acc, room) => {
            acc[room] = { condition: 'Good', notes: '', photos: [] };
            return acc;
        }, {} as InspectionState));
        setExpandedRoom(null);
    };

    const loadDraft = () => {
        const draftString = localStorage.getItem(INSPECTION_DRAFT_KEY);
        if (draftString) {
            const draft = JSON.parse(draftString);
            setRooms(draft.rooms);
            setInspectionData(draft.inspectionData);
        }
        setShowResumePrompt(false);
    };

    const saveDraft = () => {
        const draft = { rooms, inspectionData };
        localStorage.setItem(INSPECTION_DRAFT_KEY, JSON.stringify(draft));
        alert("Draft saved!");
    };
    
    const clearDraft = () => {
        localStorage.removeItem(INSPECTION_DRAFT_KEY);
    };

    const startNewInspection = () => {
        clearDraft();
        initializeInspection(defaultRooms);
        setShowResumePrompt(false);
    };

    const handleUpdateRoom = (roomName: string, updatedState: InspectionRoomState) => {
        setInspectionData(prev => ({ ...prev, [roomName]: updatedState }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting Inspection Report:", inspectionData);
        clearDraft();
        setIsSubmitted(true);
    };

    const handleAddRoom = (newRoomName: string) => {
        if (newRoomName.trim() && !rooms.includes(newRoomName.trim())) {
            const trimmedName = newRoomName.trim();
            setRooms(prev => [...prev, trimmedName]);
            setInspectionData(prev => ({
                ...prev,
                [trimmedName]: { condition: 'Good', notes: '', photos: [] }
            }));
            setIsAddRoomModalOpen(false);
            setExpandedRoom(trimmedName); // Auto-expand the new room
        } else {
            alert("Room already exists or name is invalid.");
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        if (draggedIndex === index) return;
        
        const newRooms = [...rooms];
        const [draggedItem] = newRooms.splice(draggedIndex, 1);
        newRooms.splice(index, 0, draggedItem);
        
        setRooms(newRooms);
        setDraggedIndex(null);
    };
    
    const renderContent = () => {
        if (showResumePrompt) {
            return (
                <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-2xl font-bold text-slate-800">In-Progress Inspection Found</h2>
                    <p className="mt-2 text-slate-600">Do you want to resume where you left off?</p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={loadDraft} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Resume Inspection</button>
                        <button onClick={startNewInspection} className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Start New</button>
                    </div>
                </div>
            );
        }

        if (isSubmitted) {
             return <SubmittedView onRevise={() => setIsSubmitted(false)} />;
        }

        return (
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-slate-800">Step 1: Inspect each room</h3>
                        <p className="text-sm text-slate-500 mt-1">Drag items to reorder. Click on a room to expand it. Please note the condition, add any comments, and upload photos of any damage.</p>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {rooms.map((room, index) => (
                            <div 
                                key={room}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`transition-all duration-200 ${draggedIndex === index ? 'opacity-40 bg-slate-100' : 'hover:bg-slate-50 bg-white'}`}
                            >
                                <div className="flex items-center">
                                     <div className="pl-4 pr-2 cursor-move text-slate-400 hover:text-slate-600 touch-none" title="Drag to reorder">
                                        <Bars3Icon className="w-5 h-5" />
                                     </div>
                                     <button 
                                        type="button" 
                                        onClick={() => setExpandedRoom(expandedRoom === room ? null : room)}
                                        className="w-full flex justify-between items-center p-4 pl-2 text-left"
                                     >
                                        <span className="font-semibold text-slate-700">{room}</span>
                                        {expandedRoom === room ? <ChevronUpIcon className="w-5 h-5 text-slate-500" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                                     </button>
                                </div>
                                {expandedRoom === room && (
                                    <div className="border-t border-slate-100">
                                        <RoomInspectionSection 
                                            roomName={room} 
                                            roomState={inspectionData[room] || { condition: 'Good', notes: '', photos: [] }}
                                            onUpdate={handleUpdateRoom} 
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                        <button 
                            type="button" 
                            onClick={() => setIsAddRoomModalOpen(true)}
                            className="w-full flex items-center justify-center p-3 text-sm font-semibold text-blue-600 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            <PlusIcon className="w-4 h-4 mr-2"/> Add another room
                        </button>
                    </div>
                </div>
                
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-6">
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={saveDraft} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Save Draft</button>
                        <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">Submit Final Report</button>
                    </div>
                </div>
            </form>
        );
    };

    return (
        <DashboardLayout navItems={TENANT_NAV} activePath="/tenant/move-in-inspection">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Move-in Inspection</h2>
            <p className="text-slate-500 mb-8">Please document the condition of your unit. This report will be sent to your property manager and saved for your records.</p>
            
            {renderContent()}

            <AddRoomModal 
                isOpen={isAddRoomModalOpen}
                onClose={() => setIsAddRoomModalOpen(false)}
                onAdd={handleAddRoom}
            />
        </DashboardLayout>
    );
};


export default TenantMoveInInspection;
