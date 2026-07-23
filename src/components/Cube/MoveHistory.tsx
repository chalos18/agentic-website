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
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Move History</h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {moves.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No moves yet</p>
                ) : (
                    <>
                        {groupedMoves.map((group, groupIdx) => (
                            <div
                                key={`group-${groupIdx}`}
                                className="font-mono text-sm text-gray-300 break-words"
                            >
                                {groupIdx > 0 && <span className="text-gray-600">{groupIdx * 8}: </span>}
                                {group.join(' ')}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {moves.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>
                            Total moves: <span className="text-blue-400 font-semibold">{moves.length}</span>
                        </p>
                        <p>
                            Notation:{' '}
                            <span className="text-gray-400 text-xs">R = Right, L = Left, U = Up, D = Down, F = Front, B = Back</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
