import React from 'react';

interface ReactMarkdownProps {
  children: string;
  className?: string;
}

// Mock implementation that renders markdown elements for testing
const ReactMarkdown: React.FC<ReactMarkdownProps> = ({ children, className }) => {
  // Simple markdown parsing for testing purposes
  const parseMarkdown = (text: string) => {
    // Handle bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Handle lists
  if (children.includes('\n-')) {
    const lines = children.split('\n');
    const listItems: string[] = [];
    const otherContent: string[] = [];

    lines.forEach(line => {
      if (line.trim().startsWith('-')) {
        listItems.push(line.trim().substring(1).trim());
      } else if (line.trim()) {
        otherContent.push(line);
      }
    });

    return (
      <div className={className}>
        {otherContent.length > 0 && <p>{otherContent.join(' ')}</p>}
        {listItems.length > 0 && (
          <ul>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return <div className={className}>{parseMarkdown(children)}</div>;
};

export default ReactMarkdown;
