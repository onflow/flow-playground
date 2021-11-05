export const generateCode = (project: string, id: string, type: string) => {
  const API = process.env.PLAYGROUND_API
  const scriptType = type.toLowerCase().replace('template','')
  const src = `${API}/embed?project=${project}&type=${scriptType}&id=${id}`
  return `<script src="${src}"></script>`
}
