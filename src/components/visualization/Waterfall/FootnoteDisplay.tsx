import React from 'react';
import type { FootnoteEntry } from './types';

interface FootnoteDisplayProps {
  footnotes: FootnoteEntry[];
}

export const FootnoteDisplay: React.FC<FootnoteDisplayProps> = ({ footnotes }) => {
  if (footnotes.length === 0) return null;

  // Sort footnotes on number
  footnotes.sort((a, b) => a.number - b.number);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-600">
        {footnotes.map((footnote) => (
          <div key={footnote.number} className="mb-2">
            <sup>{footnote.number}</sup> {footnote.text}
          </div>
        ))}
      </div>
    </div>
  );
};