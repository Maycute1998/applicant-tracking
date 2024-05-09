import { Box, TextField } from '@mui/material'
import { ChangeEvent } from 'react'

type UploadFileProps = {
  GetFile?: (file: File) => void
}

const UploadFile = (props: UploadFileProps) => {
  const { GetFile } = props

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      GetFile?.(event.target.files[0])
    }
  }

  return (
    <Box mb={2} flexDirection={'row'} display={'flex'}>
      <Box mr={2}>
        <TextField type='file' onChange={handleFileChange} />
      </Box>
    </Box>
  )
}

export default UploadFile
