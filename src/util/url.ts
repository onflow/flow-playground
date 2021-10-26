export const isUUUID = (projectId: string): boolean => {
  const regexp = /[\w\d]{8}-([\w\d]{4}-){3}[\w\d]{12}/
  return regexp.test(projectId)
}

export const getParams = (url: string): any =>  {
  return url.slice(1).split("&").reduce((acc:any,item: string)=>{
    const [key, value] = item.split("=")
    acc[key] = value
    return acc
  },{})
}

export const scriptTypes = ["account", "tx", "script", "readme"]
