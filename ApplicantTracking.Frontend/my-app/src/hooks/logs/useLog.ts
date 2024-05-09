import { useEffect } from "react"

type LogProps = {
  data: unknown
  groupTitle?: string
}
const useLog = (props: LogProps) => {
  const { data, groupTitle } = props
  useEffect(() => {
    console.groupCollapsed(groupTitle)
    console.log(JSON.stringify(data))
    console.groupEnd()
  }, [data, groupTitle])
}
export { useLog }
