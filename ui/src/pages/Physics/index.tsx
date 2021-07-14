import * as Yup from 'yup'

import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { Form, Formik } from 'formik'
import { Submit, TextField } from 'components/FormField'
import { setAlert, setConfirm } from 'slices/globalStatus'
import { useStoreDispatch, useStoreSelector } from 'store'

import AddIcon from '@material-ui/icons/Add'
import ConfirmDialog from 'components-mui/ConfirmDialog'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { Node } from 'api/nodes'
import NotFound from 'components-mui/NotFound'
import Paper from 'components-mui/Paper'
import Space from 'components-mui/Space'
import T from 'components/T'
import api from 'api'
import { getNodes } from 'slices/experiments'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useState } from 'react'

interface Values {
  name: string
  address: string
}

const Physics = () => {
  const intl = useIntl()

  const { nodes } = useStoreSelector((state) => state.experiments)
  const dispatch = useStoreDispatch()

  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(getNodes())
  }, [dispatch])

  useEffect(() => {
    if (nodes.length) {
      setLoading(false)
    }
  }, [nodes])

  const onSubmit = ({ name, address }: Values) => {
    api.nodes
      .add({
        name,
        kind: 'physic',
        config: btoa(address),
      })
      .then(() => {
        dispatch(
          setAlert({
            type: 'success',
            message: T('confirm.success.add', intl),
          })
        )

        setOpen(false)
        dispatch(getNodes())
      })
      .catch(console.error)
  }

  const handleRemoveNode =
    ({ name, config }: Node) =>
    () => {
      dispatch(
        setConfirm({
          title: `${T('common.delete', intl)} ${name}`,
          handle: () => {
            api.nodes
              .del(name)
              .then(() => {
                dispatch(
                  setAlert({
                    type: 'success',
                    message: T('confirm.success.delete', intl),
                  })
                )

                dispatch(getNodes())
              })
              .catch(console.error)
          },
        })
      )
    }

  return (
    <>
      <Space direction="row" mb={6}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          {T('physic.add')}
        </Button>
      </Space>

      {nodes.length > 0 && (
        <TableContainer component={(props) => <Paper {...props} sx={{ height: 'auto', p: 0, borderBottom: 'none' }} />}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{T('common.name')}</TableCell>
                <TableCell>{T('physic.address')}</TableCell>
                <TableCell>{T('common.operation')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {nodes.map((d) => (
                <TableRow key={d.name} hover>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.config}</TableCell>
                  <TableCell>
                    <Space direction="row">
                      <IconButton
                        color="primary"
                        title={T('common.delete', intl)}
                        size="small"
                        onClick={handleRemoveNode(d)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Space>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && nodes.length === 0 && (
        <NotFound illustrated textAlign="center">
          <Typography>{T('physics.notFound')}</Typography>
        </NotFound>
      )}

      <ConfirmDialog
        open={open}
        title={T('physic.add')}
        dialogProps={{
          PaperProps: {
            sx: { width: 512 },
          },
        }}
      >
        <Formik
          initialValues={{ name: '', address: '' }}
          validationSchema={Yup.object({
            name: Yup.string().trim().required('The name is required'),
            address: Yup.string().trim().required('The address is required'),
          })}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Space mt={3}>
                <TextField
                  fast
                  name="name"
                  label={T('common.name')}
                  helperText={errors.name && touched.name ? errors.name : T('physic.nameHelper')}
                  error={errors.name && touched.name ? true : false}
                />
                <TextField
                  fast
                  name="address"
                  label={T('physic.address')}
                  helperText={errors.address && touched.address ? errors.address : T('physic.addressHelper')}
                  error={errors.address && touched.address ? true : false}
                />
                <Space direction="row" justifyContent="end">
                  <Button size="small" onClick={() => setOpen(false)}>
                    {T('common.cancel')}
                  </Button>
                  <Submit />
                </Space>
              </Space>
            </Form>
          )}
        </Formik>
      </ConfirmDialog>
    </>
  )
}

export default Physics
