// regexp for extracting names of the contracts
// (?:import\s*)([\w\d]*)(?:\s*from\s*)(0x[\d\w]*)

export const getImports = (template:string) => {
  const regexp = /(?:import\s*)([\w\d]*)(?:\s*from\s*)(0x[\d\w]*)/gm
  const groups = template.matchAll(regexp)

  const result = []
  for (let group of groups){
    result.push({
      name: group[1],
      address: group[2]
    })
  }

  return result
}