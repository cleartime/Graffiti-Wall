import App from './index'
import { createRoot } from 'react-dom/client';


const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<App />);