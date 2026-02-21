import { useRef, useEffect, useState, useCallback } from 'react';
import { useJsonStore } from '../store/useJsonStore';
import EditableCell from './EditableCell';

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 20;
const OVERSCAN = 3;

function VirtualizedTable() {
  const { data, columns, exportData, reset } = useJsonStore();
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = data.length * ROW_HEIGHT;
  const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT);

  const startIndex = Math.max(0, visibleStart - OVERSCAN);
  const endIndex = Math.min(data.length, visibleEnd + OVERSCAN);

  const visibleRows = data.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  return (
    <div className="table-container">
      <div className="table-actions">
        <div className="table-info">
          Загружено записей: <strong>{data.length.toLocaleString()}</strong>
        </div>
        <div className="table-buttons">
          <button className="btn btn-secondary" onClick={reset}>
            Загрузить другой файл
          </button>
          <button className="btn btn-primary" onClick={exportData}>
            Сохранить JSON
          </button>
        </div>
      </div>

      <div ref={containerRef} className="table-scroll-container" onScroll={handleScroll}>
        <div style={{ height: totalHeight + HEADER_HEIGHT }}>
          <div className="table-header" style={{ height: HEADER_HEIGHT }}>
            <div className="table-row">
              <div className="table-cell header-cell index-cell">#</div>
              {columns.map((column) => (
                <div key={column} className="table-cell header-cell">
                  {column}
                </div>
              ))}
            </div>
          </div>

          <div
            className="table-body"
            style={{
              transform: `translateY(${offsetY + HEADER_HEIGHT}px)`,
            }}
          >
            {visibleRows.map((row, idx) => {
              const actualIndex = startIndex + idx;
              return (
                <div key={actualIndex} className="table-row">
                  <div className="table-cell index-cell">{actualIndex + 1}</div>
                  {columns.map((column) => (
                    <EditableCell
                      key={`${actualIndex}-${column}`}
                      rowIndex={actualIndex}
                      columnKey={column}
                      value={row[column]}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualizedTable;
