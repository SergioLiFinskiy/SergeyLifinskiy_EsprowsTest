import { useRef } from 'react'
import { useJsonStore } from '../store/useJsonStore'

function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const setData = useJsonStore((state) => state.setData)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)

      if (!Array.isArray(json)) {
        alert('JSON должен содержать массив объектов')
        return
      }

      if (json.length === 0) {
        alert('Массив пустой')
        return
      }

      setData(json)
    } catch (error) {
      alert('Ошибка при парсинге JSON: ' + (error as Error).message)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="uploader-container">
      <div className="uploader-card">
        <div className="upload-icon">📁</div>
        <h2>Загрузить JSON файл</h2>
        <p className="upload-description">
          Выберите файл с массивом объектов для просмотра и редактирования
        </p>
        <button className="upload-button" onClick={handleClick}>
          Выбрать файл
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p className="upload-hint">
          Поддерживаются файлы с 10000+ записями
        </p>
      </div>
    </div>
  )
}

export default FileUploader
