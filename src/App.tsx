import React, { useEffect, useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './pages/static/login/login'
import BrandManagementPage from './pages/settings/small-group-management-pages/brand-management-page/brand-management-page'
import { ProtectedRoute } from './services/routes/protected-route'
import SalesOrderManagementPage from './pages/order/sales-order/sales-order-management-page'
import DepartmentManagementPage from './pages/settings/small-group-management-pages/department-management-page/department-management-page'
import RoleManagementPage from './pages/settings/small-group-management-pages/role-management-page/role-management-page'
import CustomerSourceManagementPage from './pages/settings/small-group-management-pages/customer-source-management-page/customer-source-management-page'
import PaymentCycleManagementPage from './pages/settings/small-group-management-pages/payment-cycle-management-page/payment-cycle-management-page'
import CustomerGroup1ManagementPage from './pages/settings/small-group-management-pages/customer-group1-management-page/customer-group1-management-page'
import CustomerGroup2ManagementPage from './pages/settings/small-group-management-pages/customer-group2-management-page/customer-group2-management-page'
import CustomerGroup3ManagementPage from './pages/settings/small-group-management-pages/customer-group3-management-page/customer-group3-management-page'
import CustomerGroup4ManagementPage from './pages/settings/small-group-management-pages/customer-group4-management-page/customer-group4-management-page'
import CustomerGroup5ManagementPage from './pages/settings/small-group-management-pages/customer-group5-management-page/customer-group5-management-page'
import Home from './pages/static/dashboard/sales-order-dashboard/sales-order-dashboard'
import unExitPage from './services/lib/404'
import CreateTicketPageUser from './pages/settings/create-ticket-page/create-ticket-user'
import CreateTicketPageAdmin from './pages/settings/create-ticket-page/create-ticket-admin'
import TicketFinalProcessPage from './pages/settings/create-ticket-page/ticket-final-process'
import EmployeeManagementPage from './pages/settings/employee-management-page/employee-management-page'
import Assessment from './pages/settings/assessment/assessment/page'
import AssessmentItem from './pages/settings/assessment/assessment-item/page'
import AssessmentPlan from './pages/settings/assessment/assessment-plan/page'
import BaseProduct from './pages/product/base-product-management-page/base-product-management-page'
import Product from './pages/product/product-management-page/product-management-page'
import OutsourceProductManagementPage from './pages/product/outsource-product-management-page/outsource-product-management-page'
import WorkArrangement from './pages/order/work-order/manager/work-arrangement'
import CustomerManagementPage from './pages/customer/customer-management-page/customer-management-page'
import CityManagementPage from './pages/settings/small-group-management-pages/city-management-page/city-management-page'
import ProductTypeManagementPage from './pages/settings/small-group-management-pages/product-type-management-page/product-type-management-page'
import RawMaterialManagementPage from './pages/settings/small-group-management-pages/raw-material-management-page/raw-material-management-page'
import PackagingTypeManagementPage from './pages/settings/small-group-management-pages/packaging-type-management-page/packaging-type-management-page'
import PlateTypeManagementPage from './pages/settings/small-group-management-pages/plate-type-management-page/plate-type-management-page'
import PageGroupManagementPage from './pages/settings/page-group-management-page/page-group-management-page'
import DeliveryMethodManagementPage from './pages/settings/small-group-management-pages/delivery-method-management-page/delivery-method-management-page'
import QuotationManagementPage from './pages/customer/quotation-management-page/quotation-management-page'
import SuborderList from './pages/order/work-order/operator/suborder-list/suborder-list'
import WorkOrderManagementPage from './pages/order/work-order/manager/work-order-management-page/work-order-management-page'
import RawMaterialApplicationManagementPage
  from './pages/order/work-order/raw-material/raw-material-application-management-page/raw-material-application-management-page'
import WarehouseManagement from './pages/warehouse/warehouse-Management'
import PalletStocklogPage from './pages/warehouse/pallet-stocklog/index'
import TemporaryZone from './pages/warehouse/temporary-Zone'
import RelocateBoxes from './pages/warehouse/relocate-Boxes'
import PackagingList from './pages/order/work-order/operator/packaging-list/packaging-list'
import StockMonitorPage from './pages/order/work-order/manager/stock-monitor/stock-monitor-page'
import SalesOrder from './pages/order/order-product-tracking/sales-order'
import SameBatch from './pages/order/order-product-tracking/same-batch'
import SubOrder from './pages/order/order-product-tracking/sub-orders'
import ProductionDashBoard from './pages/static/dashboard/production-dashboard/production-dashboard'
import WarehouseConfirmManagementPage
  from './pages/order/work-order/raw-material/raw-material-application-management-page/warehouse-confirm-management-page'
import AwaitingDispatchList from './pages/warehouse/dispatch/dispatch-list/awaiting-dispatch-list'
import DispatchedTable from './pages/warehouse/dispatch/dispatch-list/dispatched-table/dispatched-table'
import CourierManagementPage from './pages/settings/small-group-management-pages/courier-management-page/courier-management-page'
import { PurchaseOrderPage } from './pages/order/purchase-order/purchase-order-page/purchase-order-page'
import { SupplierManagementPage } from './pages/order/purchase-order/supplier-management-page/supplier-management-page'
import RawMaterialStockMonitorPage
  from './pages/order/purchase-order/raw-material-stock-monitor/raw-material-stock-monitor-page'
import ProductOptionManagementPage
  from './pages/settings/small-group-management-pages/product-option-management-page/product-option-management-page'
import RawMaterialBoxManagementPage
  from './pages/warehouse/box-management/raw-material-box-management-page/raw-material-box-management-page'
import BoxManagementPage from './pages/warehouse/box-management/box-management-page/box-management-page'
import BoxInfoPage from './pages/warehouse/box-management/box-info-page/box-info-page'
import ReturnManagementPage from './pages/warehouse/return_management/return-management-page/return-management-page'
import ProdInventoryReport from './pages/reports/Prod-inventory-report/index'
import RawMaterialApplicationDetailsManagementPage
  from './pages/order/work-order/raw-material/raw-material-application-details-management-page/raw-material-application-details-management-page'
import TicketList from './pages/order/ticket/ticket-list'
import UnloadingInspectionManagementPage from './pages/warehouse/unloading/unloading-inspection-page'
import PalletStackingManagementPage
  from './pages/settings/small-group-management-pages/pallet-stacking-management-page/pallet-stacking-management-page'
import InvoiceManagementPage from './pages/order/invoice/inovice-management-page'
import SalesReportPage from './pages/order/invoice/sales-report-management-page'
import NewSalesReportPage from './pages/order/invoice/new-sales-report-management-page'
import HrListPage from './pages/settings/hr/hr-list-page/hr-list-page'
import { PurchaseOrderPageApprove } from './pages/order/purchase-order/purchase-order-page/purchase-order-page-approve'
import RolePageMappingManagementPage from './pages/settings/role-page-mapping-management-page/role-page-mapping-management-page'
import OnlineSalesOrderManagementPage from './pages/order/online-sales-order/online-sales-order-management-page'
import MachineManagementPage from './pages/settings/machine-management-page/machine-management-page'
import RecordTypeManagementPage
  from './pages/settings/small-group-management-pages/record-type-management-page/record-type-management-page'
import ContractTypeManagementPage
  from './pages/settings/small-group-management-pages/contract-type-management-page/contract-type-management-page'
import RelocatePlatePage from './pages/warehouse/relocate-plate/relocate-plate-page'
import QuoteItemsManagementPage
  from './pages/settings/small-group-management-pages/quote-items-management-page/quote-items-management-page'
import BaseProductInfosPage from './pages/product/base-product-infos-page/base-product-infos-page'
import SalesProductInfosPage from './pages/product/sales-product-infos-page/sales-product-infos-page'
import QuotationCustomerSidePage
  from './pages/customer/quotation-management-page/quotation-customer-side-page/quotation-customer-side-page'
import NotificationManagementPage from './pages/settings/notification-management-page/notification-management-page'
import QuotationOnlyDraft from './pages/customer/quotation-management-page/quotation-only-draft'
import QuotationBaseDraft from './pages/customer/quotation-management-page/quotation-base-draft'
import contractPrice from './pages/customer/quotation-management-page/contract-price'
import CustomerOnlySales from './pages/customer/customer-management-page/customer-only-sales'
import CustomerSalesView from './pages/customer/customer-management-page/customer-sales-view'
import DailyReport from './pages/static/daily-report'
import WorkArrangementPresentationOnlyPage
  from './pages/order/work-order/manager/work-arrangement/work-arrangement-presentation-only-page'
import DailyReportRecord from './pages/product/daily-report-record'
import SalesProductsList from './pages/product/base-product-infos-page/sales-products-list'
import SaleOrderManagementForSales from './pages/order/sales-order/sales-order-management-for-sales'
import DraftOrderManagementForSales from './pages/order/draft-sales-order/draft-sales-order-management-page'
import SaleOrderManagementForCustomer from './pages/order/sales-order/sales-order-management-for-customer'
import OnlineUserManagementPage from './pages/settings/online-user-management-page/online-user-management-page'
import InspectionReport from './pages/reports/inspection-report'
import PalletList from './pages/warehouse/pallet-list/index'
import OfflineAlertModal from './components/common/others/offline-alert-modal'
import { getCookie, setCookie} from 'react-use-cookie'


//getCookie('id')
  const App = () => {
  const getOffline= () => {
    if (localStorage.getItem('USER_TYPE') !== '"1"') return false
    if (window.location.pathname === '/') return false
    const offline = JSON.parse(localStorage.getItem('CHECK_USER_OFFLINE')!) ? JSON.parse(localStorage.getItem('CHECK_USER_OFFLINE')!) : false
    console.log("getOffline",localStorage.getItem('CHECK_USER_OFFLINE'))
    if (offline==true){
      if (getCookie('userName') == null || getCookie('userName') == "") 
      {
        // cookie.removeItem('token')
        localStorage.removeItem('CHECK_USER_OFFLINE')
        setCookie('lockedFlag',"")
        setCookie('TimeoutFlag',"")
        window.location.href = '/';
      }
    }
    return offline
  }
  const [modalVisible, setModalVisible] = useState<boolean>(getOffline())

  useEffect(() => {
    checkTimeout()
  }, [])

  useEffect(() => {
    window.addEventListener('onbeforeunload', function () {
      alert('Page Refreshed')
    })
    if (window.performance) {
      if (performance.navigation.type === 1) {
        console.log('This page is reloaded')
      } else {
        console.log('This page is not reloaded')
      }
    }
  })
  const checkTimeout = () => {
    let count = 0
    const outTime = 60*60
    // const outTime = 10
    window.setInterval(function() {
      // console.log('location', window.location.pathname)
      if (localStorage.getItem('USER_TYPE') !== '"1"') return
      if (getCookie('userName') == null ||getCookie('userName') == "") return
      if (window.location.pathname === '/') return
      if (getCookie('TimeoutFlag') === '1' || getCookie('TimeoutFlag') === null) {
        setCookie('TimeoutFlag', '0')
        count = 0
        return
      }
      count++
      // console.log(count)
      if (count === outTime) {
        setCookie('lockedFlag', '1')
        localStorage.setItem('CHECK_USER_OFFLINE', JSON.stringify(true))
        setModalVisible(true)
      }
    }, 1000)

    document.onmousemove = (event: any) => {
      // console.log('move', count)
      setCookie('TimeoutFlag', '1')
      count = 0
    }
  }
  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <Router>
      <Switch>
        <Route exact path={'/cus-qot'} component={QuotationCustomerSidePage} />
        {
          routes.map((route: any, index: number) => {
            return (
              <ProtectedRoute exact key={index} path={route.path} component={route.component} />
            )
          })
        }
        <ProtectedRoute exact path='*' component={unExitPage} />
      </Switch>
      <OfflineAlertModal modalVisible={modalVisible} closeModal={closeModal}/>
    </Router>
  )
}

const routes: any = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/pallet-list',
    component: PalletList
  },
  {
    path: '/brand-management-page',
    component: BrandManagementPage
  },
  {
    path: '/quotation-management',
    component: QuotationManagementPage
  },
  {
    path: '/work-order',
    component: WorkOrderManagementPage
  },
  {
    path: '/stock-monitor',
    component: StockMonitorPage
  },
  {
    path: '/base-product',
    component: BaseProduct
  },
  {
    path: '/product',
    component: Product
  },
  {
    path: '/outsource-product',
    component: OutsourceProductManagementPage
  },
  {
    path: '/page-management',
    component: PageGroupManagementPage
  },
  {
    path: '/sales-order-management',
    component: SalesOrderManagementPage
  },
  {
    path: '/sales-order-management-for-sales',
    component: SaleOrderManagementForSales
  },
  {
    path: '/draft-order-management-for-sales',
    component: DraftOrderManagementForSales
  },  
  {
    path: '/sales-order-management-for-customer',
    component: SaleOrderManagementForCustomer
  },
  {
    path: '/department-management',
    component: DepartmentManagementPage
  },
  {
    path: '/role-management',
    component: RoleManagementPage
  },
  {
    path: '/customer-source-management',
    component: CustomerSourceManagementPage
  },
  {
    path: '/customer-group1-management',
    component: CustomerGroup1ManagementPage
  },
  {
    path: '/payment-cycle-management',
    component: PaymentCycleManagementPage
  },
  {
    path: '/customer-group2-management',
    component: CustomerGroup2ManagementPage
  },
  {
    path: '/customer-group3-management',
    component: CustomerGroup3ManagementPage
  },
  {
    path: '/customer-group4-management',
    component: CustomerGroup4ManagementPage
  },
  {
    path: '/customer-group5-management',
    component: CustomerGroup5ManagementPage
  }, {
    path: '/create-ticket',
    component: CreateTicketPageUser
  },
  {
    path: '/create-ticket-admin',
    component: CreateTicketPageAdmin
  },
  {
    path: '/ticket-final-process',
    component: TicketFinalProcessPage
  },
  {
    path: '/employee-management',
    component: EmployeeManagementPage
  },
  {
    path: '/work-arrangement',
    component: WorkArrangement
  },
  {
    path: '/customer-management-page',
    component: CustomerManagementPage
  },
  {
    path: '/city-management',
    component: CityManagementPage
  },
  {
    path: '/raw-material-management',
    component: RawMaterialManagementPage
  },
  {
    path: '/raw-material-application-management',
    component: RawMaterialApplicationManagementPage
  },
  {
    path: '/warehouse-confirm',
    component: WarehouseConfirmManagementPage
  },
  {
    path: '/packaging-type-management',
    component: PackagingTypeManagementPage
  },
  {
    path: '/pallet-stacking-management',
    component: PalletStackingManagementPage
  },
  {
    path: '/plate-type-management',
    component: PlateTypeManagementPage
  },
  {
    path: '/delivery-method-management',
    component: DeliveryMethodManagementPage
  },
  {
    path: '/product-type-management',
    component: ProductTypeManagementPage
  },
  {
    path: '/suborder',
    component: SuborderList
  },
  {
    path: '/packaging',
    component: PackagingList
  },
  {
    path: '/warehouse-management',
    component: WarehouseManagement
  },
  {
    path: '/pallet_management',
    component: PalletStocklogPage
  },
  {
    path: '/temporary-zone',
    component: TemporaryZone
  },
  {
    path: '/relocate-boxes',
    component: RelocateBoxes
  },
  {
    path: '/unloading-inspection',
    component: UnloadingInspectionManagementPage
  },
  {
    path: '/production-Tracking/sales-order',
    component: SalesOrder
  },
  {
    path: '/production-Tracking/same-batch',
    component: SameBatch
  },
  {
    path: '/production-Tracking/sub-orders',
    component: SubOrder
  },
  {
    path: '/production-dashboard',
    component: ProductionDashBoard
  },
  {
    path: '/awaiting-dispatch',
    component: AwaitingDispatchList
  },
  {
    path: '/delivered',
    component: DispatchedTable
  },
  {
    path: '/dispatch',
    component: DispatchedTable
  },
  {
    path: '/courier-management',
    component: CourierManagementPage
  },
  {
    path: '/purchase-order',
    component: PurchaseOrderPage
  },
  {
    path: '/online-user',
    component: OnlineUserManagementPage
  },
  {
    path: '/purchase-order-approve',
    component: PurchaseOrderPageApprove
  },
  {
    path: '/supplier-management',
    component: SupplierManagementPage
  },
  {
    path: '/raw-material-stock-monitor',
    component: RawMaterialStockMonitorPage
  },
  {
    path: '/product-option-management',
    component: ProductOptionManagementPage
  },
  {
    path: '/raw-material-box-management',
    component: RawMaterialBoxManagementPage
  },
  {
    path: '/box-management',
    component: BoxManagementPage
  },
  {
    path: '/box-info',
    component: BoxInfoPage
  },  
  {
    path: '/return-management',
    component: ReturnManagementPage
  },
  {
    path: '/application-details',
    component: RawMaterialApplicationDetailsManagementPage
  },
  {
    path: '/ticket',
    component: TicketList
  },
  {
    path: '/invoice',
    component: InvoiceManagementPage
  },
  {   
  path: '/invoice22',
  component: InvoiceManagementPage
},
{
  path: '/invoice23&41',
  component: InvoiceManagementPage
},
{
  path: '/salesReport/:id',
  component: SalesReportPage
},
{
  path: '/newSalesReport/:id',
  component: NewSalesReportPage
},
{
    path: '/hr-list-management',
    component: HrListPage
  },
  {
    path: '/role-page-mapping-management',
    component: RolePageMappingManagementPage
  },
  {
    path: '/online-sales-order',
    component: OnlineSalesOrderManagementPage
  },
  {
    path: '/machine-management',
    component: MachineManagementPage
  },
  {
    path: '/record-type-management',
    component: RecordTypeManagementPage
  },
  {
    path: '/contract-type-management',
    component: ContractTypeManagementPage
  },
  {
    path: '/relocate-pallet',
    component: RelocatePlatePage
  },
  {
    path: '/quote-items-management',
    component: QuoteItemsManagementPage
  },
  {
    path: '/base-product-infos',
    component: BaseProductInfosPage
  },
  {
    path: '/sales-products-list',
    component: SalesProductsList
  },
  {
    path: '/sales-product-infos',
    component: SalesProductInfosPage
  },
  {
    path: '/notification-management',
    component: NotificationManagementPage
  },
  {
    path: '/assessment-items',
    component: AssessmentItem
  },
  // {
  //   path: '/assessment-config',
  //   component: AssessmentConfig
  // },
  {
    path: '/assessment-plan',
    component: AssessmentPlan
  },
  {
    path: '/assessment',
    component: Assessment
  },
  {
    path: '/quote-only-draft',
    component: QuotationOnlyDraft
  },
  {
    path: '/quote-base-draft',
    component: QuotationBaseDraft
  },
  {
    path: '/contractPrice',
    component: contractPrice
  },  
  {
    path: '/customer-only-sales',
    component: CustomerOnlySales
  },
  {
    path: '/customer-infos',
    component: CustomerSalesView
  },
  {
    path: '/daily-report',
    component: DailyReport
  },
  {
    path: '/work-arrangement-present',
    component: WorkArrangementPresentationOnlyPage
  },
  {
    path: '/daily-report-record',
    component: DailyReportRecord
  },
  {
    path: '/inspection-report',
    component: InspectionReport
  },
  {
    path: '/prod-inventory-report',
    component: ProdInventoryReport
  },
  {
    path: '/pallet-stocklog',
    component: PalletStocklogPage
  }
]

export default App
