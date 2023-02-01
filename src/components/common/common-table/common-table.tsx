import React, {useState, useEffect, useRef} from 'react'
import MaterialTable, { MTableAction, MTableToolbar } from 'material-table'
import { compareTwoObjs } from '../../../services/lib/utils/helpers'
import CommonButton from '../others/common-button'
import { Paper } from '@material-ui/core'

export interface CommonTablePropsInterface {
  title?: string
  column: any
  initData: any
  editable?: boolean
  updateData?: any
  isNotDeletable?: boolean
  isNotEditable?: boolean
  isNotAddable?: boolean
  isExportable?: boolean
  actionButtons?: any
  addRowButtonName?: string
  notAllowUpdate?: boolean
  setTableData?: any
  headerFields?: any
  isEnableSelect?: any
  onSelectionChange?: any
  onFilterChange?: any
  defaultPageSize?: number
  defaultPageSizeOptions?: any
}

export default function CommonTable(props: CommonTablePropsInterface) {
  const tableRef: any = useRef<any>()
  const actionButtons = props.actionButtons?.length ? props.actionButtons : []
  const isTableEditable = props.editable ? !props.isNotEditable : false
  const isTableAddable = props.editable ? !props.isNotAddable : false
  const isTableDeletable = props.editable ? !props.isNotDeletable : false
  const addRowButtonTooltip = 'Add'
  const addRowButtonName = props.addRowButtonName || 'Add new '
  const [data, setData] = useState(props.initData || [])
  const [column, setColumn] = useState(props.column)

  useEffect(() => {
    let isCancelled = false
    if (props.initData) {
      if (!isCancelled) {
        setData(props.initData)
      }
    }
    return () => {
      isCancelled = true
    }
  }, [props.initData])

  return (
    <div>
      <MaterialTable
        tableRef={tableRef}
        title={props.title}
        columns={column}
        data={data}
        options={{
          toolbarButtonAlignment: 'left',
          pageSizeOptions: props.defaultPageSizeOptions || [5, 10, 30, 50, 100],
          pageSize: props.defaultPageSize || 100,
          exportButton: props.isExportable?true:false,
          emptyRowsWhenPaging: false,
          filtering: true,
          debounceInterval:500,          
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          headerStyle: {
            fontSize: '1rem'
          },
          doubleHorizontalScroll: true,
          draggable: true,
          selection: props.isEnableSelect,
          paginationType: 'stepped',
        }}
        onSelectionChange={(rows) => {
          props.onSelectionChange(rows)
        }}
        onFilterChange={() => {
          if (props.onFilterChange)
            props.onFilterChange(tableRef)
        }}
        onChangePage={() => {
          window.scrollTo(0, 0);
        }}
        localization={{
          header: {
            actions: props.editable ? 'Actions' : ''
          },
          body: {
            addTooltip: addRowButtonTooltip
          }
        }}
        actions={actionButtons}
        components={{
          Action: (propsAction: any) => {
            const onBnClick = (event: any) => propsAction.action.onClick(event, propsAction.data)
            const bnProps: any = {onClick: (event: any) => onBnClick(event)}
            // Override action buttons
            for (let i = 0; i < actionButtons.length; i++) {
              if (propsAction.action.tooltip === actionButtons[i].tooltip) {
                const restProps = {...bnProps, [actionButtons[i].icon || 'block']: true}
                return <CommonButton name={actionButtons[i].tooltip} restProps={restProps} />
              }
            }
            // Override "Add Row Button"
            if (propsAction.action.tooltip === addRowButtonTooltip) {
              const addBnProps: any = {...bnProps}
              const state = tableRef.current?.state
              if (!isTableAddable || !!state?.showAddRow || !!state?.lastEditingRow) {
                addBnProps.style = {display: 'none'}
              }
              return <CommonButton name={addRowButtonName} restProps={addBnProps} />
            }
            return <MTableAction {...propsAction}/>
          },
          OverlayLoading: () => null,
          Container: props => <Paper {...props} elevation={0} style={{border: '1px solid #e2e2e2'}}/>,
          Toolbar: toolbarProps => {
            return (
              <div>
                <MTableToolbar {...toolbarProps} />
                <div className="d-flex">{
                  props.headerFields && props.headerFields.map((data: any, key: any) => {
                    return (
                      <div className="px-4" key={key}>
                        {data.click ? (<a onClick={() => data.click(data.name)}> {data.name}  </a>) : data.name}
                      </div>
                    )
                  })
                }
                </div>
              </div>
            )
          }
        }}
        editable={{
          isEditHidden: _ => !isTableEditable,
          isDeleteHidden: _ => !isTableDeletable,
          isEditable: _ => isTableEditable,
          isDeletable: _ => isTableDeletable,
          onRowAdd: (newData) => new Promise((resolve, reject) => {
            if (!props.notAllowUpdate) {
              props.updateData([...data, newData], newData, 'create')
                .then((_: any) => {
                  resolve('')
                })
                .catch((_: any) => {
                  reject('')
                })
            } else {
              if (!data) {
                props.setTableData([newData])
              } else {
                props.setTableData([...data, newData])
              }
              resolve('')
            }
          }),
          onRowDelete: (oldData: any) => new Promise((resolve, reject) => {
            const dataDelete = [...data]
            const index = oldData.tableData.id
            dataDelete.splice(index, 1)
            if (!props.notAllowUpdate) {
              props.updateData([...dataDelete], oldData, 'delete')
                .then((_: any) => {
                  setData([...dataDelete])
                  resolve('')
                })
                .catch((_: any) => {
                  reject('')
                })
            } else {
              props.setTableData(dataDelete)
              resolve('')
            }
          }),
          onRowUpdate: async (newData, oldData) => new Promise((resolve, reject) => {
            const isNothingChange = compareTwoObjs({ ...newData, tableData: null }, { ...oldData, tableData: null })
            if (isNothingChange) {
              reject('')
            } else {
              const dataUpdate = [...data]
              const index = oldData.tableData.id
              dataUpdate[index] = newData
              if (!props.notAllowUpdate) {
                props.updateData([...dataUpdate], newData, 'update')
                  .then((_: any) => {
                    setData([...dataUpdate])
                    resolve('')
                  })
                  .catch((_: any) => {
                    reject('')
                  })
              } else {
                props.setTableData(dataUpdate)
                resolve('')
              }
            }
          }),
        }}
      />
    </div>
  )
}
