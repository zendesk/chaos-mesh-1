import { resetNewExperiment, setScheduleSpecific } from 'slices/experiments'
import { useStoreDispatch, useStoreSelector } from 'store'

import { Grid } from '@material-ui/core'
import NewExperiment from 'components/NewExperimentNext'
import T from 'components/T'
import api from 'api'
import { parseSubmit } from 'lib/formikhelpers'
import { setAlert } from 'slices/globalStatus'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'

const New = () => {
  const history = useHistory()
  const intl = useIntl()

  const { env, scheduleSpecific } = useStoreSelector((state) => state.experiments)
  const dispatch = useStoreDispatch()

  const onSubmit = ({ target, basic }: any) => {
    const parsedValues = parseSubmit(
      {
        ...basic,
        target,
      },
      env
    )

    let data
    if (env === 'physic') {
      data = {
        ...parsedValues,
        kind: 'Schedule',
        spec: {
          schedule: scheduleSpecific.schedule,
          startingDeadlineSeconds: scheduleSpecific.starting_deadline_seconds,
          concurrencyPolicy: scheduleSpecific.concurrency_policy,
          historyLimit: scheduleSpecific.history_limit,
          type: 'PhysicalMachineChaos',
          physicalmachineChaos: parsedValues.spec,
        },
      }
    } else {
      const duration = parsedValues.scheduler.duration
      delete (parsedValues as any).scheduler

      data = {
        ...parsedValues,
        duration,
        ...scheduleSpecific,
      }
    }

    api.schedules[env === 'k8s' ? 'newSchedule' : 'applySchedule'](data)
      .then(() => {
        dispatch(
          setAlert({
            type: 'success',
            message: T('confirm.success.create', intl),
          })
        )

        dispatch(resetNewExperiment())
        dispatch(setScheduleSpecific({} as any))

        history.push('/schedules')
      })
      .catch(console.error)
  }

  return (
    <Grid container>
      <Grid item xs={12} lg={8}>
        <NewExperiment inSchedule={true} onSubmit={onSubmit} />
      </Grid>
    </Grid>
  )
}

export default New
