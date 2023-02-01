import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import { SuborderTakeModal } from './suborder-modal/suborder-take-modal'
import { SuborderCompleteModal } from './suborder-modal/suborder-complete-modal'
import SuborderCommonTable from './suborder-common-table'
import SuborderCommonMachineList from './suborder-common-machine-list'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { getCookie } from 'react-use-cookie'

const refreshTime=5;
const SuborderList: React.FC = () => {
  const myRef = useRef<any>(null)
  const [selectedMachine, setSelectedMachine] = useState<any>()
  const currentSelectedMachine: any = React.useRef()
  const [tableData, setTableData] = useState<any>([])
  const [selectRowData, setSelectRowData] = useState()
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [isTakeModalVisible, setIsTakeModalVisible] = useState(false)
  const [value, setValue] = useState<number>(refreshTime);
  const [timers, setTimers] = useState<Array<NodeJS.Timeout>>([]);
  const saveCallBack: any = useRef();

  // useEffect(() => {
  //   document.title = "Roster";
  //  }, [])

  const callBack = () => {
    if (isTakeModalVisible ||
      isCompleteModalVisible) {
        setValue(5);
        return
      }

    if (selectedMachine) {
      if (value <= 1) {
        currentSelectedMachine.current = selectedMachine
        setTableDataFromApi()
        return
      }
      setValue(value - 1);
    }
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    return () => { };
  });
  useEffect(() => {
    document.title = "Task List";
    const tick = () => {
      saveCallBack.current();
    };
    const timer: NodeJS.Timeout = setInterval(tick, 60000);
    timers.push(timer);
    setTimers(timers);
    console.log(timers);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false
    if (selectedMachine && !isCancelled) {
      currentSelectedMachine.current = selectedMachine
      setTableDataFromApi()
    }
    return () => {
      isCancelled = true
    }
  }, [selectedMachine])

  const setTableDataFromApi = () => {
    if (currentSelectedMachine) {
      ApiRequest({
        url: 'Suborder/GetSuborderByMachineId?id=' + currentSelectedMachine.current?.machineId,
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        setTableData(res.data.data)
        myRef.current.scrollIntoView({ behavior: 'smooth' })
        setValue(refreshTime)
      })
    }
  }

  // const verifyPassword = async () => {
  //   let userName = currentSelectedMachine.current?.operatorNavigation.userName;
  //   await SweetAlertService
  //   .inputConfirm({type: 'password', title:userName, placeholder: 'Password', defaultValue: ''})
  //   .then(res => {
  //     if (res === 'aaa') {
  //       return true;
  //     }
  //     if (res) {
  //       await ApiRequest({
  //         url: 'Employee/VerifyPassword',
  //         method: 'post',
  //         data: {
  //           userName: userName,
  //           password: res
  //         }
  //       }).then((res: any) => {
  //         return false
  //       }).catch(_ => {
  //         SweetAlertService.errorMessage('Wrong password')
  //         return false
  //       })
  //     } else {
  //       return false
  //     }
  //   })
  // }
  const togglePause = async (subOrderId: any, isPause: boolean) => {
    // SweetAlertService.inputConfirm()
    let result;
    if (isPause) {
      result = await SweetAlertService.inputConfirm({ type: 'textarea', title: 'Pause Notes暂停备注', placeholder: 'Pause Notes暂停备注', defaultValue: '' })
      if (!result) return
    }
    ApiRequest({
      url: 'Suborder/' + (isPause ? 'Pause' : 'Unpause') + 'Suborder?id=' + subOrderId + (result ? ("&notes=" + result) : "") + "&employeeId=" + getCookie('id'),
      method: 'put',
      isShowSpinner: true
    }).then(_ => {
      setTableDataFromApi()
    })
  }

  const getStatusButton = (rowData: any) => {
    if (rowData.suborderStatusId === 2) {
      return (
        <>
          <Button
            type='primary'
            onClick={() => commonShowModal(rowData, setIsCompleteModalVisible)}
            style={{ width: 100, marginLeft: '1rem' }}
          > 完成/Comp </Button>
          <Button
            type='ghost'
            onClick={() => togglePause(rowData.suborderId, true)}
            style={{ width: 100, marginTop: '1rem', marginLeft: '1rem' }}
          > 暂停/Pause </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 3) {
      return (
        <>
          <Button
            type='ghost'
            onClick={() => togglePause(rowData.suborderId, false)}
            style={{ width: 100 }}
          > 继续/Resu </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 1) {
      return (
        <>
          <Button
            style={{ backgroundColor: '#10b00b', borderColor: '#10b00b', width: 100 }}
            type='primary'
            onClick={() => commonShowModal(rowData, setIsTakeModalVisible)}
          > 取单/Take </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 4) {
      return <Button disabled={true} style={{ width: 100 }}> 取单/Take </Button>
    } else if (rowData.suborderStatusId === 10 || rowData.suborderStatusId === 9) {
      return rowData.completedDate ? (
        <div>
          {
            rowData.isSemiLast ? (
              <Button
                style={{ backgroundColor: '#09a8e9', borderColor: '#09a8e9', width: 100 }}
                type='primary'
                onClick={() => {
                  ApiRequest({
                    url: 'Box/GetAllBox?suborderId=' + rowData.suborderId,
                    method: 'get'
                  }).then((res: any) => {
                    SweetAlertService.successMessage(res.data.data[0].barCode)
                  })
                }}
              > 打印/Pr </Button>
            ) : null
          }
          <div style={{ width: '9rem', textAlign: 'right' }}>({rowData.completedDate})</div>
        </div>
      ) : null
    }
  }

  const commonShowModal = (rowData: any, setIsModalVisible: any) => {
    console.log(rowData)
    setSelectRowData(rowData)
    setIsModalVisible(true)
  }

  const commonModalProps = (visible: any, setIsModalVisible: any) => ({
    visible: visible,
    onOk: () => {
      setTableDataFromApi()
      setIsModalVisible(false)
    },
    onCancel: () => setIsModalVisible(false),
    data: selectRowData,
    machine: selectedMachine,
  })

  return (
    <div>
      { value<refreshTime &&<div style={{position:'fixed',marginTop:"30px",right:"10px",zIndex:999,border:"solid 1px",padding:"10px",color:"pink"}}>Refresh in {value} minutes!</div>}
      <SuborderCommonMachineList selectMachine={(data: any) => setSelectedMachine(data)} />
      <div ref={myRef} style={{ marginBottom: '2rem' }}>&nbsp;</div>
      <SuborderCommonTable
        getStatusButton={getStatusButton}
        selectedMachine={selectedMachine}
        tableData={tableData}
      />
      <SuborderCompleteModal {...commonModalProps(isCompleteModalVisible, setIsCompleteModalVisible)} />
      <SuborderTakeModal {...commonModalProps(isTakeModalVisible, setIsTakeModalVisible)} />
    </div>
  )
}

export default SuborderList
