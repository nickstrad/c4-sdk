import { CatalogViewer } from './lib/c4'
import './lib/c4/styles/c4.css'
export default function App() {
  return <CatalogViewer catalogUrl={import.meta.env.VITE_C4_CATALOG_URL ?? `${import.meta.env.BASE_URL}catalog.json`} />
}
