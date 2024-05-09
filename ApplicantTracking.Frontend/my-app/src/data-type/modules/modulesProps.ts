export type ModulesResponseProps = {
  id?: number
  parentId?: number
  serviceId?: number
  serviceName?: string
  code?: string
  name?: string
  description?: string
  items?: ModulesResponseProps[]
}

export type ModulesProps = {
  id?: number
  parentId?: number
  label?: string
  routePath?: string
  children?: ModulesProps[]
}

export type ModuleFormData = {
  id?: number
  parentId?: number
  serviceId: number
  code: string
  name: string
  lang?: string
  routePath?: string
  icon?: string
  description?: string
  isActive?: boolean
}
