import { useJsonStore } from './store/useJsonStore'
import FileUploader from './components/FileUploader'
import VirtualizedTable from './components/VirtualizedTable'

function App() {
  const { data } = useJsonStore()

  return (
    <div className="app">
      <header className="header">
        <h1>JSON Array Parser</h1>
        <p className="subtitle">Загрузите JSON файл для просмотра и редактирования</p>
      </header>

      <main className="main">
        {data.length === 0 ? (
          <FileUploader />
        ) : (
          <VirtualizedTable />
        )}
      </main>
    </div>
  )
}

export default App
