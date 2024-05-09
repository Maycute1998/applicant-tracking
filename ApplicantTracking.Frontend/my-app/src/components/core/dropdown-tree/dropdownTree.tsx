import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import FolderIcon from '@mui/icons-material/Folder'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { Box, IconButton, Typography } from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'
import { useRef, useState } from 'react'
import { DropdownTreeProps } from '../../../data-type'
import { useOutsideAlerter } from '../../../hooks'

type DropdownTreeProp = {
  dataSource: DropdownTreeProps[]
  size?: 'small' | 'medium'
  placeholder?: string
  width?: number | string
  itemSelectedIds?: string | null | undefined
  onChange?: (item: DropdownTreeProps) => void
}
const DropdownTree = (props: DropdownTreeProp) => {
  const { width, dataSource, placeholder, itemSelectedIds, onChange } = props
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [values, setValues] = useState<DropdownTreeProps>()

  const handleChangeTreeView = (item?: DropdownTreeProps) => {
    if (item) {
      onChange?.(item)
      setValues(item)
      setOpen(false)
    }
  }

  const handleOutsideClick = () => {
    setOpen(false)
  }

  const findMenuItemById = (id: number, items: DropdownTreeProps[]): DropdownTreeProps | undefined => {
    for (const item of items) {
      if (item.id === id) {
        return item
      }
      const childItem = findMenuItemById(id, item.children as DropdownTreeProps[])
      if (childItem) {
        return childItem
      }
    }
    return undefined
  }

  const renderTreeItem = (item: DropdownTreeProps) => {
    if (item?.children && item?.children?.length !== 0) {
      return (
        <Box onClick={() => handleChangeTreeView(item)} sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <FolderIcon fontSize='small' sx={{ mr: 1 }} />
          <Typography fontSize={13} variant='inherit'>
            {item?.label}
          </Typography>
        </Box>
      )
    } else {
      return (
        <Box onClick={() => handleChangeTreeView(item)} sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <FormatListBulletedIcon fontSize='small' sx={{ mr: 1 }} />
          <Typography variant='caption' fontSize={13}>
            {item?.label}
          </Typography>
        </Box>
      )
    }
  }

  const renderTreeViewMenu = (items: DropdownTreeProps[]) => {
    if (items && items.length !== 0) {
      return items.map(item => {
        return (
          <TreeItem2 key={item?.id?.toString()} itemId={item?.id?.toString() as string} label={renderTreeItem(item)}>
            {item?.children && renderTreeViewMenu(item?.children)}
          </TreeItem2>
        )
      })
    }
  }

  const renderTreeView = () => {
    return <SimpleTreeView selectedItems={itemSelectedIds}>{renderTreeViewMenu(dataSource)}</SimpleTreeView>
  }

  const renderPlaceholderAndValue = () => {
    const menuItemIdToFind = parseInt(itemSelectedIds as string)
    const foundMenuItem = findMenuItemById(menuItemIdToFind, dataSource)
    if (foundMenuItem) {
      return <Typography variant='subtitle1'>{foundMenuItem?.label}</Typography>
    } else {
      console.log('Menu item not found')
    }
    if (values) {
      return <Typography variant='subtitle1'>{values?.label}</Typography>
    } else {
      return <Typography variant='subtitle1'>{placeholder}</Typography>
    }
  }

  useOutsideAlerter(wrapperRef, handleOutsideClick)
  return (
    <Box ref={wrapperRef} sx={{ width: width ? width : '100%', border: '1px solid #292929', borderRadius: 1.5 }}>
      <Box sx={{ cursor: 'pointer' }} onClick={() => setOpen(!open)} flex={1} flexDirection={'row'} display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginLeft: 1 }}>{renderPlaceholderAndValue()}</Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <IconButton onClick={() => setOpen(!open)}>{open ? <ArrowDropUpIcon fontSize='small' /> : <ArrowDropDownIcon fontSize='small' />}</IconButton>
        </Box>
      </Box>
      {open && <Box>{renderTreeView()}</Box>}
    </Box>
  )
}

export default DropdownTree
