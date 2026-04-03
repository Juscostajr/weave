import { Handle, Position } from 'reactflow';
import { 
  Database, 
  HardDrive, 
  FileCode2, 
  Workflow, 
  BarChart3, 
  Zap, 
  LayoutTemplate,
  Globe
} from 'lucide-react';

// Função que define o ícone e a cor baseada no tipo do artefato
const getIconConfig = (type) => {
  const t = type ? type.toUpperCase() : '';

  if (t.includes('LAKEHOUSE')) return { icon: <HardDrive className="w-5 h-5 text-teal-600" />, bg: 'bg-teal-100' };
  if (t.includes('TABLE')) return { icon: <Database className="w-5 h-5 text-sky-600" />, bg: 'bg-sky-100' };
  if (t.includes('NOTEBOOK')) return { icon: <FileCode2 className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-100' };
  if (t.includes('PIPELINE')) return { icon: <Workflow className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100' };
  if (t.includes('DASHBOARD')) return { icon: <BarChart3 className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-100' };
  if (t.includes('APP') || t.includes('API')) return { icon: <Globe className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-100' };

  return { icon: <LayoutTemplate className="w-5 h-5 text-gray-500" />, bg: 'bg-gray-100' };
};

export default function CustomNode({ data }) {
  const config = getIconConfig(data.type);

  const isSelectedClass = data.isHighlighted 
    ? 'border-[#0078d4] ring-1 ring-[#0078d4]' 
    : 'border-gray-300 hover:border-gray-400';

  return (
    <div className={`relative min-w-[240px] bg-white rounded-md shadow-sm border transition-all duration-200 ${isSelectedClass}`}>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-gray-400 !border-white" />

      <div className="flex items-center p-3 gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-md ${config.bg}`}>
          {config.icon}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="text-[13px] font-semibold text-gray-800 truncate" title={data.label}>
            {data.label}
          </span>
          <span className="text-[11px] text-gray-500 truncate mt-0.5">
            {data.type}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-gray-400 !border-white" />
    </div>
  );
}