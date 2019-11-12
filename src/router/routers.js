import Main from '@/components/main'
import parentView from '@/components/parent-view'


// ！！！***** 模块名称需要与路由相同 *****！！！ 
// userSetting
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false)   设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  // 登录页面
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  // 主页面 --- 单页面
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      access: [100]
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          icon: '_shouye'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // 店铺详情页 -- 单页面
  {
    path: '/shopDetail',
    name: '_shopDetail',
    meta: {
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: '/shopDetail',
        name: 'shopDetail',
        meta: {
          icon: '_dianpu-xianxing',
          hideInMenu: true,
          title: route => `{{ 店铺详情 }}-${route.query.id}`,
          notCache: true,
        },
        component: () => import('@/view/shop-page/shopDetail/main.vue')
      }
    ]
  },
  // 用户设置 -- 单页面
  {
    path: '/userSetting',
    name: '_userSetting',
    meta: {
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: '/userSetting',
        name: 'userSetting',
        meta: {
          icon: '_shezhi',
          title: '修改用户设置',
          notCache: true,
        },
        component: () => import('@/view/single-page/userSetting/main.vue')
      }
    ]
  },
  //招商管理
  {
    path: '/shopOrder',
    name: 'shopOrder',
    meta: {
      icon: '_dianpu-xianxing',
      title: '商户订单',
      access: [900]
    },
    component: Main,
    children: [
      // 商户列表
      {
        path: '/shopOrderCurrent',
        name: 'shopOrderCurrent',
        meta: {
          icon: '_kucun-xianxing',
          title: '商户实时订单',
          access: [901]
        },
        component: () => import('@/view/shop-order/shopOrderCurrent/main.vue')
      },
      {
        path: '/shopOrderOld',
        name: 'shopOrderOld',
        meta: {
          icon: '_kucun-xianxing',
          title: '商户历史订单',
          access: [902]
        },
        component: () => import('@/view/shop-order/shopOrderOld/main.vue')
      },
      {
        path: '/shopOrderComment',
        name: 'shopOrderComment',
        meta: {
          icon: '_haoping-yuankuang',
          title: '订单评论',
          access: [903]
        },
        component: () => import('@/view/shop-order/shopOrderComment/main.vue')
      }
    ]
  },
  // 数据分析
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      icon: '_baobiao',
      title: '厨房数据分析',
      access: [800]
    },
    component: Main,
    children: [
      {
        path: '/analysisEntrance',
        name: 'analysisEntrance',
        meta: {
          icon: '_moduanwangdian',
          title: '起租进度',
          access: [801]
        },
        component: () => import('@/view/analysis/analysisEntrance/main.vue')
      },
      {
        path: '/analysisOrders',
        name: 'analysisOrders',
        meta: {
          icon: '_moduanwangdian',
          title: '订单数据',
          access: [802]
        },
        component: () => import('@/view/analysis/analysisOrders/main.vue')
      },
      {
        path: '/analysisOccupy',
        name: 'analysisOccupy',
        meta: {
          icon: '_mobankuangjia',
          showAlways: true,
          title: 'analysis_kitchen',
          access: [820]
        },
        component: parentView,
        children: [
          {
            path: '/analysisOccupyPie',
            name: 'analysisOccupyPie',
            meta: {
              icon: '_bingtu',
              title: 'occupy_pie',
              access: [821],
            },
            component: () => import('@/view/analysis/analysisOccupyPie/main.vue')
          },
          {
            path: '/analysisOccupyTable',
            name: 'analysisOccupyTable',
            meta: {
              icon: '_tiaoxingtu',
              title: 'occupy_table',
              access: [822]
            },
            component: () => import('@/view/analysis/analysisOccupyTable/main.vue')
          }
        ]
      },
      {
        path: '/analysisCanvass',
        name: 'analysisCanvass',
        meta: {
          icon: '_hezuoguanxi',
          showAlways: true,
          title: 'analysis_canvass',
          access: [830]
        },
        component: parentView,
        children: [
          {
            path: '/analysisCanvassSign',
            name: 'analysisCanvassSign',
            meta: {
              icon: '_dianpu',
              title: 'canvass-sign',
              access: [831]
            },
            component: () => import('@/view/analysis/analysisCanvassSign/main.vue')
          },
          {
            path: '/analysisCanvassView',
            name: 'analysisCanvassView',
            meta: {
              icon: '_kuaidiyuan',
              title: 'canvass-view',
              access: [832]
            },
            component: () => import('@/view/analysis/analysisCanvassView/main.vue')
          }
        ]
      },
      {
        path: '/analysisFinance',
        name: 'analysisFinance',
        meta: {
          icon: '_caiwu',
          showAlways: true,
          title: 'analysisFinance',
          access: [840]
        },
        component: parentView,
        children: [
          {
            path: '/analysisFinanceAccounts',
            name: 'analysisFinanceAccounts',
            meta: {
              icon: '_tuikuan',
              title: 'analysisFinanceAccounts',
              access: [843]
            },
            component: () => import('@/view/analysis/analysisFinanceAccounts/main.vue')
          },
          // {
          //   path: '/analysisFinanceIncome',
          //   name: 'analysisFinanceIncome',
          //   meta: {
          //     icon: '_daikuan-xianxing',
          //     title: 'analysisFinanceIncome',
          //     access: [841]
          //   },
          //   component: () => import('@/view/analysis/analysisFinanceIncome/main.vue')
          // },
          // {
          //   path: '/analysisFinanceExpenditure',
          //   name: 'analysisFinanceExpenditure',
          //   meta: {
          //     icon: '_huankuan-xianxing',
          //     title: 'analysisFinanceExpenditure',
          //     access: [842]
          //   },
          //   component: () => import('@/view/analysis/analysisFinanceExpenditure/main.vue')
          // },
        ]
      },
      {
        path: '/analysisKitchen',
        name: 'analysisKitchen',
        meta: {
          icon: '_dianpu',
          showAlways: true,
          title: 'analysis_kitchen',
          access: [850]
        },
        component: parentView,
        children: [
          {
            path: '/analysisKitchenEquipment',
            name: 'analysisKitchenEquipment',
            meta: {
              icon: '_PDAshouchigongzuoshebei',
              title: 'kitchen-equipment',
              access: [851]
            },
            component: () => import('@/view/analysis/analysisKitchenEquipment/main.vue')
          },
          {
            path: '/analysisKitchenMember',
            name: 'analysisKitchenMember',
            meta: {
              icon: '_yonghuziliao',
              title: 'kitchen-member',
              access: [852]
            },
            component: () => import('@/view/analysis/analysisKitchenMember/main.vue')
          }
        ]
      },
    ]
  },
  // 厨房数据
  {
    path: '/kitchenData',
    name: 'kitchenData',
    meta: {
      icon: '_tiaoxingtu-xianxing',
      title: '厨房数据',
      access: [200]
    },
    component: Main,
    children: [
      {
        path: '/kitchenDataKitchenList',
        name: 'kitchenDataKitchenList',
        meta: {
          icon: '_bingtu',
          title: '厨房列表',
          access: [201]
        },
        component: () => import('@/view/kitchen-data/kitchenDataKitchenList/main.vue')
      },
      {
        path: '/kitchenDataShopList',
        name: 'kitchenDataShopList',
        meta: {
          hideInMenu: true,
          notCache: true,
          icon: '_bingtu',
          title: route => `{{ 商户列表 }}-${route.query.tabValue}`,
          access: [202]
        },
        component: () => import('@/view/kitchen-data/kitchenDataShopList/main.vue')
      },
      {
        path: '/kitchenDataKitchenDetail',
        name: 'kitchenDataKitchenDetail',
        meta: {
          icon: '_kucun-xianxing',
          hideInMenu: true,
          title: route => `{{ 厨房详情 }}-${route.query.kitchen_id}`,
          notCache: true,
          access: [203]
        },
        component: () => import('@/view/kitchen-data/kitchenDataKitchenDetail/main.vue')
      },
      {
        path: '/kitchenDataStoreSale',
        name: 'kitchenDataStoreSale',
        meta: {
          icon: '_zitigui',
          title: '销控分析',
          access: [204]
        },
        component: () => import('@/view/kitchen-data/kitchenDataStoreSale/main.vue')
      },
    ]
  },
  // 商户管理
  {
    path: '/kitchen',
    name: 'kitchen',
    meta: {
      icon: '_shouye-xianxing',
      title: '商户管理',
      access: [300]
    },
    component: Main,
    children: [
      {
        path: '/kitchenShopList',
        name: 'kitchenShopList',
        meta: {
          icon: '_kucun-xianxing',
          title: '商户列表',
          access: [301],
        },
        component: () => import('@/view/kitchen/kitchenShopList/main.vue')
      },
      {
        path: '/kitchenShopEdit',
        name: 'kitchenShopEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `商户编辑: ${route.query.id}`,
          access: [302]
        },
        component: () => import('@/view/shop-page/kitchenShopEdit/main.vue')
      },
      {
        path: '/kitchenShopEditB',
        name: 'kitchenShopEditB',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `商户编辑: ${route.query.id}`,
          access: [303]
        },
        component: () => import('@/view/shop-page/kitchenShopEditB/main.vue')
      },
      {
        path: '/kitchenShopHandle',
        name: 'kitchenShopHandle',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `商户操作: ${route.query.id}`,
          access: [304]
        },
        component: () => import('@/view/shop-page/kitchenShopHandle/main.vue')
      },
      {
        path: '/kitchenShopHandleB',
        name: 'kitchenShopHandleB',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `商户操作: ${route.query.id}`,
          access: [305]
        },
        component: () => import('@/view/shop-page/kitchenShopHandleB/main.vue')
      },
      {
        path: '/kitchenShopEliminate',
        name: 'kitchenShopEliminate',
        meta: {
          hideInMenu: true,
          icon: '_zhongzhuanzhan',
          title: '退租页面',
          access: [306],
          notCache: true,
        },
        component: () => import('@/view/kitchen/kitchenShopEliminate/main.vue')
      },
      {
        path: '/kitchenDayInspectList',
        name: 'kitchenDayInspectList',
        meta: {
          icon: '_xunjianjianyan',
          title: '日检列表',
          access: [307]
        },
        component: () => import('@/view/kitchen/kitchenDayInspectList/main.vue')
      },
      {
        path: '/kitchenDayInspectItem',
        name: 'kitchenDayInspectItem',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `日检报告`,
          access: [308],
        },
        component: () => import('@/view/kitchen/kitchenDayInspectItem/main.vue')
      },
      {
        path: '/kitchenWeekInspectList',
        name: 'kitchenWeekInspectList',
        meta: {
          icon: '_xunjianjianyan',
          title: '周检列表',
          access: [315]
        },
        component: () => import('@/view/kitchen/kitchenWeekInspectList/main.vue')
      },
      {
        path: '/kitchenWeekInspectItem',
        name: 'kitchenWeekInspectItem',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          access: [316],
          title: route => `周检报告 `,
        },
        component: () => import('@/view/kitchen/kitchenWeekInspectItem/main.vue')
      },
      {
        path: '/kitchenNightInspectList',
        name: 'kitchenNightInspectList',
        meta: {
          icon: '_xunjianjianyan',
          title: '夜检列表',
          access: [317],
        },
        component: () => import('@/view/kitchen/kitchenNightInspectList/main.vue')
      },
      {
        path: '/kitchenNightInspectItem',
        name: 'kitchenNightInspectItem',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `夜检报告`,
          access: [318],
        },
        component: () => import('@/view/kitchen/kitchenNightInspectItem/main.vue')
      },
      {
        path: '/kitchenShopFine',
        name: 'kitchenShopFine',
        meta: {
          icon: '_weichuqin',
          title: '罚款登记',
          access: [311]
        },
        component: () => import('@/view/kitchen/kitchenShopFine/main.vue')
      },
      {
        path: '/kitchenStoreRecord',
        name: 'kitchenStoreRecord',
        meta: {
          icon: '_leidatance ',
          title: '抄表',
          access: [313]
        },
        component: () => import('@/view/kitchen/kitchenStoreRecord/main.vue')
      },
      {
        path: '/kitchenShopBill',
        name: 'kitchenShopBill',
        meta: {
          icon: '_jisuanqilishuai-xianxing-xi',
          title: '商户缴费',
          access: [314]
        },
        component: () => import('@/view/kitchen/kitchenShopBill/main.vue')
      }
    ]
  },
  //招商管理
  {
    path: '/canvass',
    name: 'canvass',
    meta: {
      icon: '_jiaosequnti',
      title: '招商管理',
      access: [400]
    },
    component: Main,
    children: [
      // 商户列表
      {
        path: '/canvassShopList',
        name: 'canvassShopList',
        meta: {
          icon: '_kucun-xianxing',
          title: '招商管理',
          access: [401]
        },
        component: () => import('@/view/canvass/canvassShopList/main.vue')
      },
      {
        path: '/canvassShopEdit',
        name: 'canvassShopEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `商务操作: ${route.query.id}`,
          access: [402]
        },
        component: () => import('@/view/shop-page/canvassShopEdit/main.vue')
      },
      {
        path: '/canvassStoreView',
        name: 'canvassStoreView',
        meta: {
          icon: '_kuaidiyuan',
          title: '带看管理',
          access: [403]
        },
        component: () => import('@/view/canvass/canvassStoreView/main.vue')
      },
      {
        path: '/canvassStoreViewAnalysis',
        name: 'canvassStoreViewAnalysis',
        meta: {
          icon: '_bingtu',
          title: '带看分析',
          access: [404]
        },
        component: () => import('@/view/canvass/canvassStoreViewAnalysis/main.vue')
      },
      {
        path: '/canvassWebBook',
        name: 'canvassWebBook',
        meta: {
          icon: '_kucun-xianxing',
          title: '网站预约',
          access: [405]
        },
        component: () => import('@/view/canvass/canvassWebBook/main.vue')
      },
      {
        path: '/canvassStoreSign',
        name: 'canvassStoreSign',
        meta: {
          icon: '_yingyongchengxu-xianxing',
          title: '签约数据',
          access: [406]
        },
        component: () => import('@/view/canvass/canvassStoreSign/main.vue')
      },
      {
        path: '/canvassStoreSignAnalysis',
        name: 'canvassStoreSignAnalysis',
        meta: {
          icon: '_zhexiantu-xianxing',
          title: '签约分析',
          access: [407]
        },
        component: () => import('@/view/canvass/canvassStoreSignAnalysis/main.vue')
      },
      {
        path: '/canvassShopPreBuild',
        name: 'canvassShopPreBuild',
        meta: {
          hideInMenu: true,
          notCache: true,
          icon: '_bingtu',
          title: route => `{{ 预建档 }}-${route.query.customer_id}`,
          access: [408]
        },
        component: () => import('@/view/canvass/canvassShopPreBuild/main.vue')
      },      
      {
        path: '/canvassShopPreBuildEdit',
        name: 'canvassShopPreBuildEdit',
        meta: {
          hideInMenu: true,
          notCache: true,
          icon: '_bingtu',
          title: route => `{{ 预建档 }}-${route.query.id}`,
          access: [409]
        },
        component: () => import('@/view/canvass/canvassShopPreBuildEdit/main.vue')
      },
    ]
  },
  // 财务管理
  {
    path: '/finance',
    name: 'finance',
    meta: {
      icon: '_caiwu',
      title: '财务管理',
      access: [500]
    },
    component: Main,
    children: [
      {
        path: '/financeShopList',
        name: 'financeShopList',
        meta: {
          icon: '_kucun-xianxing',
          title: '商户列表',
          access: [501]
        },
        component: () => import('@/view/finance/financeShopList/main.vue')
      },
      {
        path: '/financeBuild',
        name: 'financeBuild',
        meta: {
          hideInMenu: true,
          icon: '_dianpu',
          title: '新建店铺',
          access: [502],
          notCache: true,
        },
        component: () => import('@/view/finance/financeBuild/main.vue')
      },
      {
        // 退租详情页面
        path: '/financeShopEdit',
        name: 'financeShopEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `财务编辑: ${route.query.id}`,
          access: [503]
        },
        component: () => import('@/view/shop-page/financeShopEdit/main.vue')
      },
      {
        // 退租详情页面
        path: '/financeShopEditB',
        name: 'financeShopEditB',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `财务编辑: ${route.query.id}`,
          access: [504]
        },
        component: () => import('@/view/shop-page/financeShopEditB/main.vue')
      },
      {
        // 退租详情页面
        path: '/financeShopHandle',
        name: 'financeShopHandle',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `财务操作: ${route.query.id}`,
          access: [505]
        },
        component: () => import('@/view/shop-page/financeShopHandle/main.vue')
      },
      {
        // 退租详情页面
        path: '/financeShopHandleB',
        name: 'financeShopHandleB',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `财务操作: ${route.query.id}`,
          access: [506]
        },
        component: () => import('@/view/shop-page/financeShopHandleB/main.vue')
      },
      // 等待修改
      {
        path: '/financeKitchenExpend',
        name: 'financeKitchenExpend',
        meta: {
          icon: '_huankuan-xianxing ',
          title: '厨房支出',
          access: [507]
        },
        component: () => import('@/view/finance/financeKitchenExpend/main.vue')
      },
      {
        path: '/financeKitchenExpendItem',
        name: 'financeKitchenExpendItem',
        meta: {
          hideInMenu: true,
          icon: '_dianpu',
          title: '新建支出',
          access: [508]
        },
        component: () => import('@/view/finance/financeKitchenExpendItem/main.vue')
      },
      {
        path: '/financeKitchenExpendItemEdit',
        name: 'financeKitchenExpendItemEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-flower',
          notCache: true,
          title: route => `编辑支出 : ${route.query.id}`,
          access: [509]
        },
        component: () => import('@/view/finance/financeKitchenExpendItemEdit/main.vue')
      },
      {
        path: '/financeWages',
        name: 'financeWages',
        meta: {
          icon: '_youhuijuan',
          title: '厨房员工工资表',
          access: [510]
        },
        component: () => import('@/view/finance/financeWages/main.vue')
      },
      {
        path: '/financeKitchenBill',
        name: 'financeKitchenBill',
        meta: {
          icon: '_jisuanqilishuai-xianxing-xi',
          title: '厨房账单',
          access: [511]
        },
        component: () => import('@/view/finance/financeKitchenBill/main.vue')
      },
      {
        path: '/financeErrorQuit',
        name: 'financeErrorQuit',
        meta: {
          icon: '_zhucetianjiahaoyou',
          hideInMenu: true,
          title: route => `异常退款 : ${route.query.id}`,
          access: [512],
          notCache: true,
        },
        component: () => import('@/view/finance/financeErrorQuit/main.vue')
      },
      {
        path: '/financeShopPreBuildEdit',
        name: 'financeShopPreBuildEdit',
        meta: {
          hideInMenu: true,
          notCache: true,
          icon: '_bingtu',
          title: route => `{{ 预建档 }}-${route.query.id}`,
          access: [513]
        },
        component: () => import('@/view/finance/financeShopPreBuildEdit/main.vue')
      },
    ]
  },
  // 传播
  {
    path: '/spread',
    name: 'spread',
    meta: {
      icon: '_diamond',
      title: '商户运营',
      access: [700]
    },
    component: Main,
    children: [
      {
        path: '/spreadShopList',
        name: 'spreadShopList',
        meta: {
          icon: '_shouye-xianxing',
          title: '商户运营列表',
          access: [701]
        },
        component: () => import('@/view/spread/spreadShopList/main.vue')
      },
      {
        path: '/spreadStoreList',
        name: 'spreadStoreList',
        meta: {
          icon: '_anzhuangshigong-xianxing',
          title: '商户授权',
          // access: [710]
        },
        component: () => import('@/view/spread/spreadStoreList/main.vue')
      },
      {
        path: '/spreadShopSort',
        name: 'spreadShopSort',
        meta: {
          icon: '_hongbao-xianxing',
          title: '排序列表',
          access: [707]
        },
        component: () => import('@/view/spread/spreadShopSort/main.vue')
      },
      {
        path: '/spreadApplyList',
        name: 'spreadApplyList',
        meta: {
          icon: '_hongbao-xianxing',
          title: '申领列表',
          access: [702]
        },
        component: () => import('@/view/spread/spreadApplyList/main.vue')
      },
      {
        path: '/spreadShopEleAuthorize',
        name: 'spreadShopEleAuthorize',
        meta: {
          icon: '_anzhuangshigong-xianxing',
          title: '商户授权',
          // access: [708]
        },
        component: () => import('@/view/spread/spreadShopEleAuthorize/main.vue')
      },
      {
        path: '/spreadShopMeituanAuthorize',
        name: 'spreadShopMeituanAuthorize',
        meta: {
          icon: '_anzhuangshigong-xianxing',
          title: '商户授权',
          // access: [709]
        },
        component: () => import('@/view/spread/spreadShopMeituanAuthorize/main.vue')
      },
      {
        path: '/spreadMiniConfig',
        name: 'spreadMiniConfig',
        meta: {
          icon: '_anzhuangshigong-xianxing',
          title: '小程序设置',
          access: [703]
        },
        component: () => import('@/view/spread/spreadMiniConfig/main.vue')
      },
      {
        path: '/spreadUsersList',
        name: 'spreadUsersList',
        meta: {
          icon: '_jiaosequnti',
          title: '用户列表',
          access: [704]
        },
        component: () => import('@/view/spread/spreadUsersList/main.vue')
      },
      {
        path: '/spreadShopMemberList',
        name: 'spreadShopMemberList',
        meta: {
          icon: '_yonghuziliao',
          title: '商户账号',
          access: [705]
        },
        component: () => import('@/view/spread/spreadShopMemberList/main.vue')
      },
      {
        path: '/spreadInviteList',
        name: 'spreadInviteList',
        meta: {
          icon: '_zhucetianjiahaoyou',
          title: '邀请列表',
          access: [706]
        },
        component: () => import('@/view/spread/spreadInviteList/main.vue')
      },
    ]
  },
  // 配置
  {
    path: '/permission',
    name: 'permission',
    meta: {
      icon: '_yonghuziliao',
      title: '权限操作',
      access: [600]
    },
    component: Main,
    children: [
      {
        path: '/permissionMemberList',
        name: 'permissionMemberList',
        meta: {
          icon: '_jiaosequnti',
          title: '人员列表',
          access: [601]
        },
        component: () => import('@/view/permission/permissionMemberList/main.vue')
      },
      {
        path: '/permissionAddMember',
        name: 'permissionAddMember',
        meta: {
          icon: '_zhucetianjiahaoyou',
          title: '添加人员',
          access: [602],
          notCache: true,
        },
        component: () => import('@/view/permission/permissionAddMember/main.vue')
      },
      {
        path: '/permissionEditMember',
        name: 'permissionEditMember',
        meta: {
          icon: '_zhucetianjiahaoyou',
          hideInMenu: true,
          title: route => `编辑信息 : ${route.query.id}`,
          access: [603],
          notCache: true,
        },
        component: () => import('@/view/permission/permissionEditMember/main.vue')
      },
      {
        path: '/permissionKeyList',
        name: 'permissionKeyList',
        meta: {
          icon: '_liebiaoshitucaidan',
          title: '权限列表',
          access: [604]
        },
        component: () => import('@/view/permission/permissionKeyList/main.vue')
      },
      {
        path: '/permissionAddKey',
        name: 'permissionAddKey',
        meta: {
          icon: '_yonghuziliao-xianxing',
          title: '添加权限组',
          access: [605],
          notCache: true,
        },
        component: () => import('@/view/permission/permissionAddKey/main.vue')
      },
      {
        path: '/permissionEditKey',
        name: 'permissionEditKey',
        meta: {
          hideInMenu: true,
          icon: '_qianshoushenpitongguo',
          notCache: true,
          title: route => `编辑权限 : ${route.query.id}`,
          access: [606]
        },
        component: () => import('@/view/permission/permissionEditKey/main.vue')
      },
      {
        path: '/permissionSelectConfig',
        name: 'permissionSelectConfig',
        meta: {
          icon: '_ziyuan',
          title: '工单配置',
          access: [607]
        },
        component: () => import('@/view/permission/permissionSelectConfig/main.vue')
      },
      {
        path: '/permissionCityList',
        name: 'permissionCityList',
        meta: {
          icon: '_weizhi',
          title: '城市列表',
          access: [608],
        },
        component: () => import('@/view/permission/permissionCityList/main.vue')
      },
      {
        path: '/permissionBrandList',
        name: 'permissionBrandList',
        meta: {
          icon: '_tijikongjian',
          title: '品牌列表',
          access: [609],
        },
        component: () => import('@/view/permission/permissionBrandList/main.vue')
      },
      {
        path: '/permissionAreaList',
        name: 'permissionAreaList',
        meta: {
          icon: '_tijikongjian',
          title: '地区列表',
          // access: [611],
        },
        component: () => import('@/view/permission/permissionAreaList/main.vue')
      },
      {
        path: '/permissionKitchenMemberList',
        name: 'permissionKitchenMemberList',
        meta: {
          icon: '_jiaosequnti',
          title: '人员列表',
          access: [610]
        },
        component: () => import('@/view/permission/permissionKitchenMemberList/main.vue')
      },
    ]
  }, 
  // 401
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  // 500
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  // 404
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
