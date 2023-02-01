import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

const useStyles = makeStyles(() => ({
  date: {
    minWidth: '7rem'
  },
}))

type Props = {
  columnDef: any;
  onFilterChanged: (rowId: string, value?:any) => void;
  label?: string;
};

const CommonDatePickerFilter: React.FC<Props> = (props) => {
  const { columnDef, onFilterChanged, label } = props
  const classes = useStyles()
  const returnDate:any = {
    startDate: '',
    endDate: ''
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} >
      <div style={{display:"flex"}} >
      <KeyboardDatePicker
      name="a"
        className={classes.date}
        style={{margin:"0px", marginTop:"0px", paddingRight:"6px" }}
        disableToolbar
        id={`date-picker-${columnDef.tableData.id}`}
        variant="inline"
        inputVariant="standard"
        format="yyyy-MM-dd"
        margin="normal"
        error={false}
        helperText={null}
        value={(columnDef.tableData.filterValue && columnDef.tableData.filterValue.startDate) || null}
        onChange={(_, inputValue) => {
          onFilterChanged(columnDef.tableData.id, {
            startDate: inputValue,
            endDate: columnDef.tableData.filterValue ? columnDef.tableData.filterValue.endDate : ''
          })
        }}
        label={'Start date'}
        // InputLabelProps={{ shrink: false }}
      />
      <KeyboardDatePicker
            name="b"
        className={classes.date}
        style={{margin:"0px", marginTop:"0px"}}
        disableToolbar
        id={`date-picker-${columnDef.tableData.id}-2`}
        variant="inline"
        inputVariant="standard"
        format="yyyy-MM-dd"
        margin="normal"
        error={false}
        helperText={null}
        value={(columnDef.tableData.filterValue && columnDef.tableData.filterValue.endDate) || null}
        onChange={(_, inputValue) => {
          onFilterChanged(columnDef.tableData.id, {
            endDate: inputValue,
            startDate: columnDef.tableData.filterValue ? columnDef.tableData.filterValue.startDate : ''
          })
        }}
        label={'End date'}
        // InputLabelProps={{ shrink: false }}
      />
      </div>
    </MuiPickersUtilsProvider>
  )
}

export default CommonDatePickerFilter
