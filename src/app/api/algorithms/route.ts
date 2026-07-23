/**
 * GET /api/algorithms - Fetch algorithms
 * Supports filtering and searching
 */

import { NextRequest, NextResponse } from 'next/server';
import { ALGORITHM_SEEDS, getAlgorithmsByStage, searchAlgorithms } from '@/services/AlgorithmSeeds';
import { SolvingStage } from '@/types/cube';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const stage = searchParams.get('stage');
        const difficulty = searchParams.get('difficulty');
        const query = searchParams.get('q');

        let algorithms = [...ALGORITHM_SEEDS];

        // Apply filters
        if (stage && Object.values(SolvingStage).includes(stage as SolvingStage)) {
            algorithms = getAlgorithmsByStage(stage as SolvingStage);
        }

        if (difficulty) {
            const diffNum = parseInt(difficulty);
            if (diffNum >= 1 && diffNum <= 5) {
                algorithms = algorithms.filter((a) => a.difficulty === diffNum);
            }
        }

        if (query) {
            algorithms = searchAlgorithms(query);
        }

        return NextResponse.json(
            {
                success: true,
                count: algorithms.length,
                data: algorithms,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching algorithms:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch algorithms' },
            { status: 500 }
        );
    }
}
