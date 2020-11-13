import {useProject} from "providers/Project/projectHooks";

export const generateCode = (id: string, typeName: string) => {
  const { project } = useProject()
  const API = "http://localhost:8080"
  const scriptType = typeName.toLowerCase().replace('template','')
  const src = `${API}/embed/${project.id}/${scriptType}/${id}`
  return `<script src="${src}"></script>`
}