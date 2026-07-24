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
            <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line space-y-4">
                <h3 className="text-lg font-bold text-espresso mb-4">Filter Algorithms</h3>

                {/* Search */}
                <div>
                    <label className="block text-sm text-espresso-light mb-2">Search</label>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search algorithms..."
                        className="w-full px-4 py-2 bg-cream text-espresso rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
                    />
                </div>

                {/* Stage Filter */}
                <div>
                    <label className="block text-sm text-espresso-light mb-2">Solving Stage</label>
                    <select
                        value={selectedStage}
                        onChange={(e) =>
                            handleStageFilter((e.target.value as SolvingStage) || '')
                        }
                        className="w-full px-4 py-2 bg-cream text-espresso rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
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
                    <label className="block text-sm text-espresso-light mb-2">Difficulty</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDifficultyFilter(0)}
                            className={`flex-1 py-2 rounded-lg transition-colors ${selectedDifficulty === 0
                                    ? 'bg-terracotta text-cream'
                                    : 'bg-cream text-espresso-light hover:bg-clay-line border border-clay-line'
                                }`}
                        >
                            All
                        </button>
                        {[1, 2, 3, 4, 5].map((difficulty) => (
                            <button
                                key={difficulty}
                                onClick={() => handleDifficultyFilter(difficulty)}
                                className={`flex-1 py-2 rounded-lg transition-colors ${selectedDifficulty === difficulty
                                        ? 'bg-terracotta text-cream'
                                        : 'bg-cream text-espresso-light hover:bg-clay-line border border-clay-line'
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
                <h3 className="text-lg font-bold text-espresso">
                    {loading ? 'Loading...' : `${algorithms.length} Algorithm${algorithms.length !== 1 ? 's' : ''}`}
                </h3>

                {error && (
                    <div className="bg-terracotta/10 border border-terracotta rounded-lg p-4">
                        <p className="text-terracotta-dark">⚠️ {error}</p>
                    </div>
                )}

                {!loading && algorithms.length === 0 && (
                    <div className="bg-cream-deep rounded-2xl p-8 border border-clay-line text-center">
                        <p className="text-espresso-light">No algorithms found matching your filters.</p>
                    </div>
                )}

                {/* Algorithm Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {algorithms.map((algo, index) => (
                        <div
                            key={index}
                            onClick={() => onAlgorithmSelect?.(algo)}
                            className="bg-cream-deep rounded-2xl p-4 border border-clay-line hover:border-terracotta transition-colors cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-espresso font-bold group-hover:text-terracotta-dark transition-colors">
                                    {algo.name}
                                </h4>
                                <span className="px-2 py-1 bg-mustard/20 text-mustard-dark text-xs rounded-full">
                                    {'⭐'.repeat(algo.difficulty)}
                                </span>
                            </div>

                            <p className="text-espresso-light text-sm mb-3">{algo.description}</p>

                            <code className="text-sage-dark font-mono text-xs block mb-3 break-all">
                                {algo.notation}
                            </code>

                            <span className="inline-block px-2 py-1 bg-sage/15 text-sage-dark text-xs rounded-full">
                                {algo.stage.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
