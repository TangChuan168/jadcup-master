import { Tag, Button, Col, Row } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import React, { useEffect, useRef, useState } from 'react'
import {PackagingPrintQrModal} from './packaging-modal/packaging-print-qr-modal'
import {PackagingAssignPlateModal} from './packaging-modal/packaging-assign-plate-modal'
import {PackagingPlateManagementModal} from './packaging-modal/packaging-plate-management-modal'
import {SuborderTakeModal} from '../suborder-list/suborder-modal/suborder-take-modal'
import SuborderCommonTable from '../suborder-list/suborder-common-table'
import SuborderCommonMachineList from '../suborder-list/suborder-common-machine-list'
import { getSelectOptions } from '../../../../../components/common/common-form/common-form-select'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { PackagingCompleteModal } from './packaging-modal/packaging-complete-modal'

const refreshTime=5;
const PackagingList = () => {
  const myRef = useRef<any>(null)
  const [selectedMachine, setSelectedMachine] = useState<any>()
  const [tableData, setTableData] = useState<any>([])
  const [selectRowData, setSelectRowData] = useState<any>()
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [isPrintQrModalVisible, setIsPrintQrModalVisible] = useState(false)
  const [isAssignPlateModalVisible, setIsAssignPlateModalVisible] = useState(false)
  const [isTakeModalVisible, setIsTakeModalVisible] = useState(false)
  const [isPlateManagementModalVisible, setIsPlateManagementModalVisible] = useState(false)
  const [plateList, setPlateList] = useState([])
  const currentOP: any = React.useRef()

  const [value, setValue] = useState<number>(refreshTime);
  const [timers, setTimers] = useState<Array<NodeJS.Timeout>>([]);
  const saveCallBack: any = useRef();

  const callBack = () => {
    if (isPlateManagementModalVisible
    ||isAssignPlateModalVisible
    ||isPrintQrModalVisible
    ||isCompleteModalVisible
    ||isTakeModalVisible ) {
      setValue(5);
      return
    } 
    if (selectedMachine) {
      if (value <= 1) {
        // currentSelectedMachine.current = selectedMachine
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
    setPackagePlateList()
  }, [])

  const setPackagePlateList = () => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate?package=1',
      method: 'get'
    }).then(res => {
      setPlateList(res.data.data)
    })
  }

  useEffect(() => {
    let isCancelled = false
    console.log(selectedMachine)
    currentOP.current = selectedMachine
    if (selectedMachine && !isCancelled) {
      setTableDataFromApi()
    }
    return () => {
      isCancelled = true
    }
  }, [selectedMachine])

  const setTableDataFromApi = () => {
    ApiRequest({
      url: 'Suborder/GetSuborderByMachineId?id=' + selectedMachine.machineId,
      method: 'get',
      isShowSpinner: true
    }).then(res => {
      setTableData(res.data.data)
      myRef.current.scrollIntoView({behavior: 'smooth'})
      setValue(refreshTime)      
    })
  }

  const getStatusButton = (rowData: any) => {
    if (rowData.suborderStatusId === 2) {
      return (
        <>
          <Button
            type='primary'
            onClick={() => showPrintQrModal(rowData)}
            style={{width: 110, marginLeft: '1rem'}}
          > 打条形码/QR </Button>
          <Button
            type='primary'
            style={{width: 110, marginTop: '1rem', marginLeft: '1rem'}}
            onClick={() => showAssignPlateModal(rowData)}
          > 配托盘/Pallet </Button>
           { rowData.isProdFinishForPak &&<Button
            type='primary'
            style={{backgroundColor: '#10b00b', borderColor: '#10b00b', width: 110, marginTop: '1rem', marginLeft: '1rem'}}
            onClick={() => showCompleteModal(rowData)}
          > 完成/Comp </Button>}
        </>
      )
    } else if (rowData.suborderStatusId === 1) {
      return (
        <>
          <Button
            style={{backgroundColor: '#10b00b', borderColor: '#10b00b', width: 100}}
            type='primary'
            onClick={() => showTakeModal(rowData)}
          > 取单/Take </Button>
        </>
      )
    } else if (rowData.suborderStatusId === 10) {
      return rowData.completedDate ? <div style={{width: '9rem', textAlign: 'right'}}>({rowData.completedDate})</div> : null
    }
  }

  const showCompleteModal = (rowData: any, isNotRequiredPassword?: boolean) => commonShowModal(rowData, setIsCompleteModalVisible, isNotRequiredPassword)

  const showPrintQrModal = (rowData: any, isNotRequiredPassword?: boolean) => commonShowModal(rowData, setIsPrintQrModalVisible, isNotRequiredPassword)

  const showAssignPlateModal = (rowData: any, isNotRequiredPassword?: boolean) => commonShowModal(rowData, setIsAssignPlateModalVisible, isNotRequiredPassword)

  const showTakeModal = (rowData: any, isNotRequiredPassword?: boolean) => commonShowModal(rowData, setIsTakeModalVisible, isNotRequiredPassword)

  const commonShowModal = (rowData: any, setIsModalVisible: any, isNotRequiredPassword?: boolean) => {
    if (isNotRequiredPassword) {
      openModal(rowData, setIsModalVisible)
      return
    }
    SweetAlertService
      .inputConfirm({type: 'password', title: currentOP.current.operatorNavigation.userName, placeholder: 'Password', defaultValue: ''})
      .then(res => {
        if (res === 'aaa') {
          openModal(rowData, setIsModalVisible)
          return
        }
        if (res) {
          ApiRequest({
            url: 'Employee/VerifyPassword',
            method: 'post',
            data: {
              userName: currentOP.current.operatorNavigation?.userName,
              password: res
            }
          }).then((res: any) => {
            openModal(rowData, setIsModalVisible)
          }).catch(_ => {
            SweetAlertService.errorMessage('Wrong password')
          })
        }
      })
  }

  const openModal = (rowData: any, setIsModalVisible: any) => {
    setSelectRowData(null)
    setTimeout(() => {
      setSelectRowData(rowData)
    })
    setIsModalVisible(true)
  }

  const commonModalProps = (visible: any, setIsModalVisible: any, name?: any) => {
    return {
      visible: visible,
      onOk: (isShowNextModal?: boolean) => {
        console.log(name)
        setIsModalVisible(false)
        setTableDataFromApi()
        switch (name) {
          case 'printQr':
            showAssignPlateModal(selectRowData, true)
            break
          case 'isTake':
            showPrintQrModal(selectRowData, true)
            break
          case 'assignPlate':
            if (isShowNextModal) {
              showCompleteModal(selectRowData, true)
            }
            break
        }
      },
      onCancel: () => setIsModalVisible(false),
      data: selectRowData,
      machine: selectedMachine,
      isPackaging: true,
      isNotRequiredPassword: true,
    }
  }

  const updateCompleteModalValue = async (requestValue: any) => {
    const formValues: any = []
    const resPlateBox = await ApiRequest({
      url: 'PlateBox/GetAllPlateBox?suborderId=' + selectRowData.suborderId,
      method: 'get',
      isShowSpinner: true
    })
    if (resPlateBox) {
      const plateBoxData = resPlateBox.data.data || []
      const res = await getSelectOptions('', 'Box/GetAllBox?suborderId=' + selectRowData.suborderId)
      if (res) {
        res.map((row: any) => {
          const filteredValue = plateBoxData.filter((plateBoxItem: any) => plateBoxItem.boxId === row.boxId)[0]
          formValues.push({
            boxId: row.boxId,
            barCode: row.barCode,
            quantity: filteredValue?.plateId ? filteredValue?.box?.quantity : 0,
            plateId: filteredValue?.plateId || null
          })
        })
        const qty = formValues.reduce((a: number, c: any) => a + c?.quantity, 0)
        if (qty) {
          return {
            ...requestValue,
            quantity: qty
          }
        } else {
          SweetAlertService.errorMessage('请先分配托盘/Please assign pallet firstly.')
          return 'err'
        }
      }
    }
  }

  return (
    <div>
      { value<refreshTime &&<div style={{position:'fixed',marginTop:"30px",right:"10px",zIndex:999,border:"solid 1px",padding:"10px",color:"pink"}}>Refresh in {value} minutes!</div>}      
      <Row gutter={[16, 16]} style={{marginBottom: '1rem'}}>
        <Col>
          <Button type="primary" onClick={() => setIsPlateManagementModalVisible(true)}>托盘管理/Pallet management</Button>
        </Col>
        <Col>
          {
            plateList.splice(10).map((row: any, index: any) => <Tag color="cyan" key={index}>P:{row.plateCode}</Tag>)
          }
        </Col>
      </Row>
      <SuborderCommonMachineList
        isPackaging={true}
        selectMachine={(data: any) => setSelectedMachine(data)}
      />
      <div ref={myRef} style={{marginBottom: '2rem'}}>&nbsp;</div>
      <SuborderCommonTable
        isPackaging={true}
        getStatusButton={getStatusButton}
        selectedMachine={selectedMachine}
        tableData={tableData}
      />
      <PackagingPlateManagementModal {...commonModalProps(isPlateManagementModalVisible, setIsPlateManagementModalVisible, 'plateManagement')} />
      <PackagingAssignPlateModal {...commonModalProps(isAssignPlateModalVisible, setIsAssignPlateModalVisible, 'assignPlate')} />
      <PackagingPrintQrModal {...commonModalProps(isPrintQrModalVisible, setIsPrintQrModalVisible, 'printQr')} />
      <PackagingCompleteModal {...commonModalProps(isCompleteModalVisible, setIsCompleteModalVisible, 'isComplete')} updateValueFn={updateCompleteModalValue} />
      <SuborderTakeModal {...commonModalProps(isTakeModalVisible, setIsTakeModalVisible, 'isTake')} />
    </div>
  )
}

export default PackagingList
