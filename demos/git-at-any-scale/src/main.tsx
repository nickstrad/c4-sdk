import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CatalogViewer } from '../../../src/lib/c4'
import '../../../src/lib/c4/styles/c4.css'
import './style.css'
createRoot(document.getElementById('root')!).render(<StrictMode><CatalogViewer title="Git at any scale" catalogUrl={`${import.meta.env.BASE_URL}catalog.json`} /></StrictMode>)
