/**
 * AlgorithmLibrary Component
 * Displays algorithms in a searchable, filterable list
 */

'use client';

import { useState } from 'react';
import { Algorithm, SolvingStage } from '@/types/cube';
import { useAlgorithms } from '@/hooks/useAlgorithms';

interface AlgorithmLibraryProps {
    onAlgorithmSelect?: (algorithm: Algorithm) => void;
}

export default function AlgorithmLibrary({ onAlgorithmSelect }: AlgorithmLibraryProps) {
    const { algorithms, loading, error, search, filterByStage, filterByDifficulty, reset } =
        useAlgorithms();

    const [searchInput, setSearchInput] = useState('');
    const [selectedStage, setSelectedStage] = useState<SolvingStage | ''>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);

    const handleSearch = (value: string) => {
        setSearchInput(value);
        search(value);
    };

    const handleStageFilter = (stage: SolvingStage | '') => {
        setSelectedStage(stage);
        if (stage) {
            filterByStage(stage);
        } else {
            reset();
        }
    };

    const handleDifficultyFilter = (difficulty: number) => {
        setSelectedDifficulty(difficulty);
        if (difficulty > 0) {
            filterByDifficulty(difficulty);
        } else {
            reset();
        }
    };

    const stages = Object.values(SolvingStage);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Filter Algorithms</h3>

                {/* Search */}
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Search</label>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search algorithms..."
                        className="w-full px-4 py-2 bg-gray-900 text-gray-100 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Stage Filter */}
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Solving Stage</label>
                    <select
                        value={selectedStage}
                        onChange={(e) =>
                            handleStageFilter((e.target.value as SolvingStage) || '')
                        }
                        className="w-full px-4 py-2 bg-gray-900 text-gray-100 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">All Stages</option>
                        {stages.map((stage) => (
                            <option key={stage} value={stage}>
                                {stage.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDifficultyFilter(0)}
                            className={`flex-1 py-2 rounded transition-colors ${selectedDifficulty === 0
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            All
                        </button>
                        {[1, 2, 3, 4, 5].map((difficulty) => (
                            <button
                                key={difficulty}
                                onClick={() => handleDifficultyFilter(difficulty)}
                                className={`flex-1 py-2 rounded transition-colors ${selectedDifficulty === difficulty
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {'⭐'.repeat(difficulty)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                    {loading ? 'Loading...' : `${algorithms.length} Algorithm${algorithms.length !== 1 ? 's' : ''}`}
                </h3>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 rounded p-4">
                        <p className="text-red-300">⚠️ {error}</p>
                    </div>
                )}

                {!loading && algorithms.length === 0 && (
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                        <p className="text-gray-400">No algorithms found matching your filters.</p>
                    </div>
                )}

                {/* Algorithm Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {algorithms.map((algo, index) => (
                        <div
                            key={index}
                            onClick={() => onAlgorithmSelect?.(algo)}
                            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">
                                    {algo.name}
                                </h4>
                                <span className="px-2 py-1 bg-yellow-900 text-yellow-100 text-xs rounded">
                                    {'⭐'.repeat(algo.difficulty)}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-3">{algo.description}</p>

                            <code className="text-green-400 font-mono text-xs block mb-3 break-all">
                                {algo.notation}
                            </code>

                            <span className="inline-block px-2 py-1 bg-blue-900 text-blue-100 text-xs rounded">
                                {algo.stage.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
