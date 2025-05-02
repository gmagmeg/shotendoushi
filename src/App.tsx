import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import BookstoreSearch from './components/BookstoreSearch'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<BookstoreSearch />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
