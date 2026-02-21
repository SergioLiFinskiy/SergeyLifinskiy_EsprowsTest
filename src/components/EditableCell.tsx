import { useState, useRef, useEffect } from 'react'
import { useJsonStore } from '../store/useJsonStore'

interface EditableCellProps {
  rowIndex: number
  columnKey: string
  value: unknown
}

function EditableCell({ rowIndex, columnKey, value }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const updateRow = useJsonStore((state) => state.updateRow)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setEditValue(String(value ?? ''))
    setIsEditing(true)
  }

  const handleSave = () => {
    let newValue: unknown = editValue

    if (typeof value === 'number') {
      newValue = Number(editValue)
    } else if (typeof value === 'boolean') {
      newValue = editValue === 'true'
    }

    updateRow(rowIndex, columnKey, newValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const displayValue = value === null || value === undefined
    ? ''
    : typeof value === 'object'
      ? JSON.stringify(value)
      : String(value)

  if (isEditing) {
    return (
      <div className="table-cell editing">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="cell-input"
        />
      </div>
    )
  }

  return (
    <div className="table-cell" onDoubleClick={handleDoubleClick} title="Дважды кликните для редактирования">
      {displayValue}
    </div>
  )
}

export default EditableCell
