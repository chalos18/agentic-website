/**
 * MoveHistory Component
 * Displays the history of moves made on the cube
 */

'use client';

interface MoveHistoryProps {
    /** Any puzzle's notation, not just the 3x3's. */
    moves: readonly string[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
    // Group moves into lines of 8 for readability (standard notation format)
    const groupedMoves: string[][] = [];
    for (let i = 0; i < moves.length; i += 8) {
        groupedMoves.push(moves.slice(i, i + 8));
    }

    return (
        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
            <h2 className="text-lg font-bold text-espresso mb-4">Move history</h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {moves.length === 0 ? (
                    <p className="text-espresso-light text-center py-8">Turn a face to start a solve.</p>
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
                        <p className="text-espresso-light/80">
                            A prime (&apos;) reverses a turn; a 2 makes it a half turn.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
