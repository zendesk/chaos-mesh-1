import { getIn, useFormikContext } from 'formik'

import { AutocompleteMultipleField } from 'components/FormField'
import Space from 'components-mui/Space'
import T from 'components/T'
import { useStoreSelector } from 'store'

const Nodes = () => {
  const { errors, touched } = useFormikContext()

  const { nodes } = useStoreSelector((state) => state.experiments)

  return (
    <Space>
      <AutocompleteMultipleField
        name={'scope.addresses'}
        label={T('physic.select')}
        helperText={
          getIn(touched, 'scope.addresses') && getIn(errors, 'scope.addresses')
            ? getIn(errors, 'scope.addresses')
            : T(nodes.length === 0 ? 'physic.noAddress' : 'common.multiOptions')
        }
        options={nodes.map((n) => `${n.name}: ${n.config}`)}
        error={getIn(errors, 'scope.addresses') && getIn(touched, 'scope.addresses') ? true : false}
        disabled={nodes.length === 0}
      />
    </Space>
  )
}

export default Nodes
