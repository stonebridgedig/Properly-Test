import React, { useState, useEffect } from 'react';
import type { Property, Building, Unit, SyndicationListing, SyndicationPlatform } from '../../types';
import { XMarkIcon, ZillowIcon, TruliaIcon, ApartmentsIcon, CheckCircleIcon } from '../Icons';

interface SyndicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (listing: SyndicationListing) => void;
    unitData: { property: Property; building: Building; unit: Unit } | null;
}

const SyndicationModal: React.FC<SyndicationModalProps> = ({ isOpen, onClose, onPublish, unitData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SyndicationPlatform>>(new Set());

    useEffect(() => {
        if (isOpen && unitData) {
            const existingListing = unitData.unit.syndication;
            setTitle(existingListing?.title || `For Rent: ${unitData.unit.bedrooms} Bed Apartment at ${unitData.property.name}`);
            setDescription(existingListing?.description || '');
            setSelectedPlatforms(new Set(existingListing?.platforms || []));
        }
    }, [isOpen, unitData]);
    
    const handlePlatformToggle = (platform: SyndicationPlatform) => {
        setSelectedPlatforms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(platform)) {
                newSet.delete(platform);
            } else {
                newSet.add(platform);
            }
            return newSet;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPlatforms.size === 0) {
            alert('Please select at least one platform to publish to.');
            return;
        }
        const newListing: SyndicationListing = {
            title,
            description,
            platforms: Array.from(selectedPlatforms),
            publishedDate: new Date().toISOString(),
        };
        onPublish(newListing);
    };
    
    const platformOptions: { name: SyndicationPlatform; icon: React.FC<{className?: string}> }[] = [
        { name: 'Zillow', icon: ZillowIcon },
        { name: 'Trulia', icon: TruliaIcon },
        { name: 'Apartments.com', icon: ApartmentsIcon },
    ];

    if (!isOpen || !unitData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Syndicate Listing</h2>
                            <p className="text-sm text-slate-500">Publish vacancy for {unitData.unit.name} at {unitData.property.name}</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="listing-title" className="block text-sm font-medium text-slate-700">Listing Title</label>
                            <input
                                id="listing-title"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="listing-description" className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                id="listing-description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={8}
                                required
                                className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                                placeholder={`Beautiful ${unitData.unit.bedrooms} bed, ${unitData.unit.bathrooms} bath unit available now...`}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Publish to</label>
                             <div className="grid grid-cols-3 gap-4">
                                {platformOptions.map(({ name, icon: Icon }) => {
                                    const isSelected = selectedPlatforms.has(name);
                                    return (
                                        <button
                                            type="button"
                                            key={name}
                                            onClick={() => handlePlatformToggle(name)}
                                            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                                        >
                                            <Icon className="h-8" />
                                            <span className="mt-2 text-sm font-semibold text-slate-700">{name}</span>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 text-blue-600">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-6 bg-slate-50 border-t space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Publish Listing</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SyndicationModal;