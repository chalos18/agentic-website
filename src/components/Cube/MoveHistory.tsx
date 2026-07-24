/**
 * MoveHistory Component
 * Displays the history of moves made on the cube
 */

'use client';

import { MoveNotation } from '@/types/cube';

interface MoveHistoryProps {
    moves: MoveNotation[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
    // Group moves into lines of 8 for readability (standard notation format)
    const groupedMoves = [];
    for (let i = 0; i < moves.length; i += 8) {
        groupedMoves.push(moves.slice(i, i + 8));
    }

    return (
        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
            <h2 className="text-lg font-bold text-espresso mb-4">Move History</h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {moves.length === 0 ? (
                    <p className="text-espresso-light text-center py-8">No moves yet</p>
                ) : (
                    <>
                        {groupedMoves.map((group, groupIdx) => (
                            <div
                                key={`group-${groupIdx}`}
                                className="font-mono text-sm text-espresso break-words"
                            >
                                {groupIdx > 0 && <span className="text-espresso-light/60">{groupIdx * 8}: </span>}
                                {group.join(' ')}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {moves.length > 0 && (
                <div className="mt-4 pt-4 border-t border-clay-line">
                    <div className="text-xs text-espresso-light space-y-1">
                        <p>
                            Total moves: <span className="text-terracotta-dark font-semibold">{moves.length}</span>
                        </p>
                        <p>
                            Notation:{' '}
                            <span className="text-espresso-light/80 text-xs">R = Right, L = Left, U = Up, D = Down, F = Front, B = Back</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
