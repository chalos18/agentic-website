/**
 * useAlgorithms Hook
 * Fetches and manages algorithms from the API
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Algorithm, SolvingStage } from '@/types/cube';

interface UseAlgorithmsReturn {
    algorithms: Algorithm[];
    loading: boolean;
    error: string | null;
    search: (query: string) => void;
    filterByStage: (stage: SolvingStage) => void;
    filterByDifficulty: (difficulty: number) => void;
    reset: () => void;
}

export function useAlgorithms(): UseAlgorithmsReturn {
    const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        stage?: SolvingStage;
        difficulty?: number;
        query?: string;
    }>({});

    // Fetch algorithms with current filters
    const fetchAlgorithms = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (filters.stage) {
                params.append('stage', filters.stage);
            }
            if (filters.difficulty) {
                params.append('difficulty', filters.difficulty.toString());
            }
            if (filters.query) {
                params.append('q', filters.query);
            }

            const response = await fetch(`/api/algorithms?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch algorithms');
            }

            const data = await response.json();
            setAlgorithms(data.data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setAlgorithms([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch when filters change
    useEffect(() => {
        fetchAlgorithms();
    }, [fetchAlgorithms]);

    const search = useCallback((query: string) => {
        setFilters((prev) => ({ ...prev, query }));
    }, []);

    const filterByStage = useCallback((stage: SolvingStage) => {
        setFilters((prev) => ({ ...prev, stage }));
    }, []);

    const filterByDifficulty = useCallback((difficulty: number) => {
        setFilters((prev) => ({ ...prev, difficulty: difficulty > 0 ? difficulty : undefined }));
    }, []);

    const reset = useCallback(() => {
        setFilters({});
    }, []);

    return {
        algorithms,
        loading,
        error,
        search,
        filterByStage,
        filterByDifficulty,
        reset,
    };
}
