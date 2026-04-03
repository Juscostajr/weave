import React from 'react';
import { X, Table, Activity, Box, Database } from 'lucide-react';

export default function Sidebar({ node, onClose }) {
  if (!node) return null;

  const { label, type, namespace, schema, runId } = node.data;

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-600" /> Detalhes do Artefato
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {/* Info Básica */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome</label>
          <p className="text-lg font-bold text-gray-900">{label}</p>
          <span className="inline-block mt-1 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
            {type}
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace / Namespace</label>
          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <Database className="w-4 h-4" />
            <span className="text-sm font-mono">{namespace}</span>
          </div>
        </div>

        {/* Metadados Condicionais (Ex: Se for Tabela no Fabric) */}
        {schema && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Esquema da Tabela</label>
            <div className="bg-gray-50 rounded-lg border border-gray-100">
              {schema.map((col, idx) => (
                <div key={idx} className="flex justify-between p-2 text-sm border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-600">{col.name}</span>
                  <span className="text-gray-400 font-mono text-xs italic">{col.type || 'string'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {runId && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Última Execução (Run ID)</label>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100">
              <Activity className="w-4 h-4 text-yellow-600" />
              <span className="font-mono truncate">{runId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button 
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          onClick={() => alert(`Abrindo no portal: ${label}`)}
        >
          Visualizar no Microsoft Fabric
        </button>
      </div>
    </div>
  );
}