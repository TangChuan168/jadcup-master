import React, {useEffect, useState} from 'react'
import { Button, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Row } from 'antd'
import {Table} from 'antd'
import moment from 'moment'
import ISelectForNormal from '../../../../../components/common/i-select-for-normal'
import swal from '../../../../../services/lib/utils/sweet-alert-service'
import CommonMachineCard from '../../../../../components/common/others/common-machine-card'
import {
  deleteArrangementRequest,
  getDateRequest,
  getEmployeeRequest,
  getMachineRequest, getWeekRequest,
  postArrangementRequest, updateArrangementRequest
} from '../../../../../services/others/work-arrangement-services'
import { commonFormSelect, getSelectOptions } from '../../../../../components/common/common-form/common-form-select'
import { urlKey } from '../../../../../services/api/api-urls'
import { ButtonsForPageLink } from './work-arrangement-presentation-only-page'

interface machine2{
  machineId: number,
  machineName: string,
  machineTypeId: number,
  picture: string
}
const WorkArrangement: any = (props: {isPresentOnly: boolean}) => {

  const [Date, setDate] = useState<any>(moment())
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [userSelect, setUserSelect] = useState<any>([])
  const [allMachines, setAllMachines] = useState<any>([])
  const [arrangeData, setArrangeData] = useState<any>([])
  const [newUser, setNewUser] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'))
  const [selectedStr, setSelectedStr] = useState<any>()
  const [employeeOptions, setEmployeeOptions] = useState([])

  useEffect(() => {
    document.title = "Roster";
   }, [])

  useEffect(() => {
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res.map((row: any) => ({...row, name: row.firstName + ' ' + row.lastName}))))
    getEmployeeRequest()
      .then((res) => {
        // console.log(res.data.data, 'getDataFromApi')
        const users = dataTransfer(res.data.data, 'users')
        setUserSelect(users)
      }
      )
    getMachineRequest()
      .then((res) => {
        // console.log(res.data.data,'machine')
        const machines = dataTransfer(res.data.data, 'machines')
        setAllMachines(machines)
        getArrangementData(selectedDate, machines)
      })
  }, [])

  const weekday = (day: any, selectedDay?:string,) => {
    return moment(selectedDay).isoWeekday(day).format('YYYY-MM-DD')
  }

  //maintenance
  const getArrangementData = (date:any, machines:any) => {
    // console.log(date,'1111')
    getWeekRequest(weekday(1, date), weekday(7, date))
      .then((res:any) => {
        // console.log(res.data.data,'week')
        const tableData = mergeTest(machines, res.data.data, date)
        // console.log(tableData,'tableDataInWeek')
        setArrangeData(tableData)
      })
  }

  const mergeTest = (machines:any, allMachinesOperateTime:any, selectedDay:string) => {
    const newArray:any = []

    // console.log(machines,'machines')
    // console.log(allMachinesOperateTime,'second')
    if (allMachinesOperateTime.length === 0) {
      machines.forEach((res:any) => {
        // console.log(res,'res')
        newArray.push({
          machine: res,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        })
      })
    } else {
      machines.forEach((res:any) => {
        const obj:any = {
          machine: res,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        }
        for (let i = 0; i < allMachinesOperateTime.length; i++) {
          // console.log(res.name,allMachinesOperateTime[i])
          if (res.id === allMachinesOperateTime[i].machine.machineId) {
            // console.log('i')
            // console.log(res.name,allMachinesOperateTime[i],weekday(1,selectedDay),selectedDay)
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(1, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(1,selectedDay),selectedDay)
              // console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(1,selectedDay))
              obj.monday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(2, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(2,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(2,selectedDay))
              obj.tuesday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(3, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(3,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(3,selectedDay))
              obj.wednesday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(4, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(4,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(4,selectedDay))
              obj.thursday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(5, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(5,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(5,selectedDay))
              obj.friday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(6, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(6,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(6,selectedDay))
              obj.saturday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
            if (allMachinesOperateTime[i].workingDate.slice(0, 10) === weekday(7, selectedDay)) {
              // console.log(res.name,allMachinesOperateTime[i],weekday(7,selectedDay))
              //     console.log(allMachinesOperateTime[i].operatorNavigation.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation.lastName,weekday(7,selectedDay))
              obj.sunday = {
                user: {
                  id: allMachinesOperateTime[i].operatorNavigation?.employeeId,
                  name: allMachinesOperateTime[i].operatorNavigation?.firstName + ' ' + allMachinesOperateTime[i].operatorNavigation?.lastName,
                },
                arrangeId: allMachinesOperateTime[i].arrangementId,
                maintenance: allMachinesOperateTime[i].maintenance
              }
            }
          }
        }
        newArray.push(obj)
      })
    }
    return newArray
  }

  //改变datepicker的function
  const selectHandler = (data:any, dateString:string) => {
    setSelectedDate(dateString)
    getArrangementData(dateString, allMachines)
  }

  const dataTransfer = (data:any, filter: string) => {
    const newArray:any = []
    if (filter === 'machines') {
      data.map((res:machine2) => {
        newArray.push({
          id: res.machineId,
          img: res.picture,
          name: res.machineName,
          type_id: res.machineTypeId
        }
        )
      })
    }

    if (filter === 'users') {
      data.map((res:any) => {
        newArray.push({
          id: res.employeeId,
          name: res.firstName + ' ' + res.lastName
        })
      })
    }
    // console.log(newArray)
    return newArray
  }

  const onchange = (data: any, rowData:any, days:any, selectedDay:any) => {
    console.log(rowData, days, rowData[days], 'onchange rowData')
    const finalData:any = {
      machine: rowData.machine,
      user: { id: data.value, name: data.children},
      selectedDay: selectedDay,
      day: days,
      maintenance: rowData[days]?.maintenance
    }
    console.log(finalData, 'in select user')

    if (rowData[days]?.arrangeId) {
      // console.log('good',rowData[days])
      finalData.arrangeId = rowData[days].arrangeId
    }
    // console.log(finalData,'in select user')

    // console.log(rowData[days],'这一天有没有arrange')
    // console.log(days,'days')
    // console.log(data, rowData,'select 得到的数据')
    // console.log(rowData, merge, 'select 得到的数据2')
    // console.log(finalData, 'complete')
    const copyNewUser = [...newUser]
    // console.log(newUser,'newUser')

    const indexOfSelector = copyNewUser.findIndex((element:any) => element.machine.id === finalData.machine.id && element.selectedDay === finalData.selectedDay)
    if (indexOfSelector !== -1) {
      // console.log(copyNewUser[c].user,finalData,'copyNewUser[c]')
      copyNewUser[indexOfSelector].user.id = finalData.user.id
      copyNewUser[indexOfSelector].user.name = finalData.user.name
      setNewUser(copyNewUser)
    } else {
      setNewUser((prevState:any) => [...prevState, finalData])
    }

  }

  const checkBoxOnChange = (checked:boolean, rowData:any, days:any, selectedDate:any, isChecked:any) => {
    // console.log(checked,rowData,days,selectedDate,isChecked,'传上来了')
    const finalData:any = {
      machine: rowData.machine,
      user: {id: rowData[days]?.user?.id, name: rowData[days]?.user?.name},
      selectedDay: selectedDate,
      day: days,
      maintenance: checked === true ? 1 : 0
    }

    if (rowData[days]?.arrangeId) {
      // console.log('good',rowData[days])
      finalData.arrangeId = rowData[days].arrangeId
    }

    // console.log(rowData[days],'rowData[days]')
    const copyNewUser = [...newUser]
    // console.log(copyNewUser,'copyUser in checkbox')
    const indexOfCheck = copyNewUser.findIndex((element:any) => element.machine.id === finalData.machine.id && element.selectedDay === finalData.selectedDay)
    // console.log(indexOfCheck,'判断copyUser里面是否有一样的')
    if (indexOfCheck === -1) {
      // console.log(finalData, 'in -1')
      setNewUser((prevState:any) => [...prevState, finalData])
    } else {
      copyNewUser[indexOfCheck].maintenance = finalData.maintenance
      setNewUser(copyNewUser)
    }
    console.log(newUser, finalData, 'newUser')

  }

  const getWeekTextRender = (data: any) => {
    return (
      <>
        {data?.user?.id ? (<span style={{background: selectedStr && data?.user?.name?.toLowerCase().includes(selectedStr.toLowerCase()) ? 'yellow' : 'none'}}>{data?.user?.name}</span>) : ''}
        {data?.maintenance === 1 && (<span style={{color: 'red'}}><b> (M)</b></span>) }
      </>
    )
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: ['machine', 'name'],
      key: 'name',
      width: 200
    },
    {
      title: 'Monday (' + (weekday(1, selectedDate).slice(5)) + ')',
      // dataIndex: 'monday',
      key: 'monday',
      render: (text:any, record:any) => {
        // console.log(text,'得到的数据')
        // console.log(text.friday)
        // console.log(Object.keys(text)[1],'lll')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(1, selectedDate)} title={Object.keys(text)[1]} defaultValue={text.monday?.user?.id} location={text} placeholder={text.monday?.user?.name} data={userSelect} onChange={onchange}/>
                {/*<Checkbox onChange={checkBoxOnChange}/>*/}
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[1]} date={weekday(1, selectedDate)} isChecked={text.monday?.maintenance}/>
              </>
              :
              getWeekTextRender(text.monday)
            }
          </>
        )
      }
    },
    {
      title: 'Tuesday (' + (weekday(2, selectedDate).slice(5)) + ')',
      // dataIndex: 'tuesday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(2, selectedDate)} title={Object.keys(text)[2]} defaultValue={text.tuesday?.user?.id} location={text} placeholder={text.tuesday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[2]} date={weekday(2, selectedDate)} isChecked={text.tuesday?.maintenance}/>
              </>
              :
              getWeekTextRender(text.tuesday)
            }
          </>
        )
      }
    },
    {
      title: 'Wednesday (' + (weekday(3, selectedDate).slice(5)) + ')',
      // dataIndex: 'wednesday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(3, selectedDate)} title={Object.keys(text)[3]} defaultValue={text.wednesday?.user?.id} location={text} placeholder={text.wednesday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[3]} date={weekday(3, selectedDate)} isChecked={text.wednesday?.maintenance}/>

              </>
              :
              getWeekTextRender(text.wednesday)
            }
          </>
        )
      }
    },
    {
      title: 'Thursday (' + (weekday(4, selectedDate).slice(5)) + ')',
      // dataIndex: 'thursday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(4, selectedDate)} title={Object.keys(text)[4]} defaultValue={text.thursday?.user?.id} location={text} placeholder={text.thursday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[4]} date={weekday(4, selectedDate)} isChecked={text.thursday?.maintenance}/>
              </>
              :
              getWeekTextRender(text.thursday)
            }
          </>
        )
      }
    },
    {
      title: 'Friday (' + (weekday(5, selectedDate).slice(5)) + ')',
      // dataIndex: 'friday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(5, selectedDate)} title={Object.keys(text)[5]} defaultValue={text.friday?.user?.id} location={text} placeholder={text.friday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[5]} date={weekday(5, selectedDate)} isChecked={text.friday?.maintenance}/>
              </>
              :
              getWeekTextRender(text.friday)
            }
          </>
        )
      }
    },
    {
      title: 'Saturday (' + (weekday(6, selectedDate).slice(5)) + ')',
      // dataIndex: 'saturday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(6, selectedDate)} title={Object.keys(text)[6]} defaultValue={text.saturday?.user?.id} location={text} placeholder={text.saturday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[6]} date={weekday(6, selectedDate)} isChecked={text.saturday?.maintenance}/>

              </>
              :
              getWeekTextRender(text.saturday)
            }
          </>
        )
      }
    },
    {
      title: 'Sunday (' + (weekday(7, selectedDate).slice(5)) + ')',
      // dataIndex: 'sunday',
      key: 'name',
      render: (text:any, record:any) => {
        // console.log(text,record,'得到的数据')
        return (
          <>
            {isEdit ?
              <>
                <ISelectForNormal date={weekday(7, selectedDate)} title={Object.keys(text)[7]} defaultValue={text.sunday?.user?.id} location={text} placeholder={text.sunday?.user?.name} data={userSelect} onChange={onchange}/>
                <ICheckBox checkBoxChange={checkBoxOnChange} location={text} title={Object.keys(text)[7]} date={weekday(7, selectedDate)} isChecked={text.sunday?.maintenance}/>

              </>
              :
              getWeekTextRender(text.sunday)
            }
          </>
        )
      }
    },
  ]

  const submitHandler2 = async () => {
    const postData:any = []
    const updateData:any = []
    const deleteData:number[] = []
    const updateToTable = [...arrangeData]
    // console.log(updateToTable,'updateToTable')
    // console.log(newUser,'in submit')
    newUser.forEach((res:any) => {
      // console.log(res,'newU ForEach')

      //modifyData找到得是newUser里每个所对应的在column里的index
      const modifyData = updateToTable.findIndex((res1:any) => res1.machine === res.machine)
      console.log(updateToTable[modifyData], 'updateToTable[modifyData]')
      // updateToTable[modifyData] = res

      // console.log(updateToTable[modifyData][res.day],res.day)
      if (updateToTable[modifyData][res.day] === null) {
        console.log(res, 'post')
        const obj = {
          machineId: res.machine.id,
          operator: res.user?.id,
          workingDate: res.selectedDay,
          maintenance: res.maintenance
        }
        console.log(obj, 'postObj')
        postData.push(obj)
      } else {
        if (res.user.id === null) {
          console.log(res, 'delete')
          deleteData.push(res.arrangeId)
        } else {
          console.log(res, 'put')
          const obj = {
            machineId: res.machine.id,
            operator: res.user.id,
            workingDate: res.selectedDay,
            arrangementId: res.arrangeId,
            maintenance: res.maintenance
          }
          console.log(obj, 'putObj')
          updateData.push(obj)
        }

      }
    })

    const result = await swal.confirmMessage()
    if (result) {
      if (postData.length !== 0) {
        // console.log(postData,'post')
        postArrangementRequest(postData).then(res => console.log(res, 'post成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      if (updateData.length !== 0) {
        // console.log(updateData,'put')
        updateArrangementRequest(updateData).then(res => console.log(res, 'put成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      if (deleteData.length !== 0) {
        // console.log(deleteData,'delete')
        deleteArrangementRequest(deleteData).then(res => console.log(res, 'delete成功')).then(_ => getArrangementData(selectedDate, allMachines))
      }
      setArrangeData(updateToTable)
    }
    setIsEdit(false)
    setNewUser([])
  }
  return (
    <div>
      <Row>
        <Col span={24}>
          <h1 style={{margin: 0}}>
            {props.isPresentOnly ? 'Weekly Schedule' : 'Work Arrangement'}
            {props.isPresentOnly ? (
              <div>
                <ButtonsForPageLink />
              </div>
            ) : null}
            <div style={{width: '30%'}}>
              {commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], false, (value: any) => setSelectedStr(value), 'name', 'Find name')}
            </div>
          </h1>
          <Row style={{padding: '1rem 0'}}>
            <Col span={8}>
              <DatePicker onChange={selectHandler} defaultValue={moment(Date, 'YYYY-MM-DD')} style={{width: '100%'}} />
            </Col>
          </Row>
          <Row>
            {props.isPresentOnly ? null : (
              <div style={{display: 'flex', justifyContent: 'flex-start', margin: '0 0 1rem 0'}}>
                {!isEdit && <Button type="primary" style={{float: 'right'}} onClick={() => setIsEdit(true)}>Edit</Button>}
                <div style={{float: 'right'}}>
                  {isEdit && <Button type="primary" onClick={submitHandler2}>Submit</Button>}&nbsp;
                  {isEdit && <Button onClick={() => setIsEdit(false)}>Cancel</Button>}
                </div>
              </div>
            )}
            <div style={{width: '100%'}}>
              <Table columns={columns} dataSource={arrangeData} pagination={false} />
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

const ICheckBox = (props:{checkBoxChange:(data:any, rowData:any, days:any, selectedDay:any, isChecked:any) => void, location:any, title:any, date:any, isChecked:number}) => {
  const [isChecked, setIsChecked] = useState(props.isChecked === 1)
  // console.log(props.isChecked)
  const onChangeHandler = (e:any) => {
    // console.log(e.target.checked)
    setIsChecked(!isChecked)

    props.checkBoxChange(e.target.checked, props.location, props.title, props.date, props.isChecked)
  }
  return (
    <Checkbox style={ {marginLeft: '0.5rem'} } onChange={ onChangeHandler } checked={ isChecked } />
  )
}

export default WorkArrangement
