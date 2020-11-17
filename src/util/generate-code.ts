export const generateCode = (projectId: string, modelId: string, typeName: string) => {
  const API = process.env.PLAYGROUND_API
  const scriptType = typeName.toLowerCase().replace('template','')
  const src = `${API}/embed/${projectId}/${scriptType}/${modelId}`
  return `<script src="${src}"></script>`
}