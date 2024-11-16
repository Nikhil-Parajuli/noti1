import React from 'react';
import { ArrowLeft, Gift, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface AirdropPanelProps {
  onClose: () => void;
  notifications: Notification[];
  onDelete: (id: string) => void;
}

const AirdropPanel: React.FC<AirdropPanelProps> = ({ onClose, notifications, onDelete }) => {
  const sortedAirdrops = [...notifications].sort((a, b) => {
    const statusPriority = { active: 0, upcoming: 1, expired: 2 };
    return statusPriority[a.airdropStatus as keyof typeof statusPriority] - 
           statusPriority[b.airdropStatus as keyof typeof statusPriority];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={onClose} className="mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Available Airdrops</h2>
      </div>

      <div className="space-y-4">
        {sortedAirdrops.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No airdrops available at the moment</p>
          </div>
        ) : (
          sortedAirdrops.map((airdrop) => (
            <div key={airdrop.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{airdrop.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{airdrop.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amount: {airdrop.amount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Ends: {new Date(airdrop.endDate || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    airdrop.airdropStatus === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : airdrop.airdropStatus === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {airdrop.airdropStatus}
                  </span>
                  <button
                    onClick={() => onDelete(airdrop.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {airdrop.actionUrl && airdrop.airdropStatus === 'active' && (
                <button 
                  onClick={() => window.open(airdrop.actionUrl, '_blank')}
                  className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Claim Airdrop</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AirdropPanel;