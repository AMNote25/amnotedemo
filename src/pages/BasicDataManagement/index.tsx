import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Target, 
  UserCheck, 
  CreditCard, 
  Key, 
  Calculator, 
  Warehouse, 
  Package, 
  Layers, 
  Archive, 
  Grid, 
  Ruler, 
  FileText, 
  ScrollText,
  ChevronRight,
  Database
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  slug: string;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'company-management',
    title: 'Quản lý công ty',
    icon: <Building2 size={32} />,
    slug: '/company-management',
    description: 'Quản lý thông tin công ty và chi nhánh',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'user-management',
    title: 'Quản lý người dùng',
    icon: <Users size={32} />,
    slug: '/user-management',
    description: 'Quản lý tài khoản và phân quyền người dùng',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'cost-center',
    title: 'Đối tượng tập hợp chi phí',
    icon: <Target size={32} />,
    slug: '/cost-center',
    description: 'Quản lý các đối tượng tập hợp chi phí',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'customer-management',
    title: 'Quản lý khách hàng',
    icon: <UserCheck size={32} />,
    slug: '/customer-management',
    description: 'Quản lý thông tin khách hàng và đối tác',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'bank-management',
    title: 'Quản lý ngân hàng',
    icon: <CreditCard size={32} />,
    slug: '/bank-management',
    description: 'Quản lý tài khoản ngân hàng và giao dịch',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'code-registration',
    title: 'Đăng ký mã quản lý',
    icon: <Key size={32} />,
    slug: '/code-registration',
    description: 'Đăng ký và quản lý các mã hệ thống',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'account-management',
    title: 'Quản lý tài khoản',
    icon: <Calculator size={32} />,
    slug: '/account-management',
    description: 'Quản lý hệ thống tài khoản kế toán',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'warehouse-management',
    title: 'Quản lý kho bãi',
    icon: <Warehouse size={32} />,
    slug: '/warehouse-management',
    description: 'Quản lý thông tin kho bãi và vị trí',
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 'warehouse-category',
    title: 'Quản lý thể loại kho',
    icon: <Package size={32} />,
    slug: '/warehouse-category',
    description: 'Phân loại và quản lý thể loại kho',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'inventory-declaration',
    title: 'Khai báo hàng tồn kho',
    icon: <Layers size={32} />,
    slug: '/inventory-declaration',
    description: 'Khai báo và theo dõi hàng tồn kho',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'material-group',
    title: 'Quản lý mã nhóm vật tư',
    icon: <Archive size={32} />,
    slug: '/material-group',
    description: 'Phân nhóm và quản lý mã vật tư',
    color: 'from-lime-500 to-lime-600'
  },
  {
    id: 'unit-management',
    title: 'Quản lý mã đơn vị tính',
    icon: <Grid size={32} />,
    slug: '/unit-management',
    description: 'Quản lý các đơn vị tính trong hệ thống',
    color: 'from-violet-500 to-violet-600'
  },
  {
    id: 'standard-management',
    title: 'Quản lý mã tiêu chuẩn',
    icon: <Ruler size={32} />,
    slug: '/standard-management',
    description: 'Quản lý các mã tiêu chuẩn và quy định',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'note-management',
    title: 'Quản lý ghi chú',
    icon: <FileText size={32} />,
    slug: '/note-management',
    description: 'Quản lý ghi chú và chú thích hệ thống',
    color: 'from-rose-500 to-rose-600'
  },
  {
    id: 'contract-management',
    title: 'Quản lý hợp đồng',
    icon: <ScrollText size={32} />,
    slug: '/contract-management',
    description: 'Quản lý hợp đồng và thỏa thuận',
    color: 'from-slate-500 to-slate-600'
  }
];

export default function BasicDataManagement() {
  const navigate = useNavigate();

  const handleMenuClick = (slug: string) => {
    navigate(slug);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Database className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý dữ liệu cơ bản</h1>
            <p className="text-gray-600 mt-2">
              Quản lý và cấu hình các dữ liệu cơ bản của hệ thống kế toán
            </p>
          </div>
        </div>
        
        
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMenuClick(item.slug)}
            className="group relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-red-300 hover:bg-gradient-to-br hover:from-white hover:to-red-50 active:scale-95"
          >
            <div className="flex flex-row items-center gap-4">
              {/* Icon trái */}
              <div className="w-14 h-14 bg-white border border-gray-300 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-sm">
                <div className="text-black group-hover:text-red-600">
                  {React.isValidElement(item.icon)
                    ? React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5 text-black group-hover:text-red-700" })
                    : item.icon}
                </div>
              </div>

              {/* Nội dung phải */}
              <div className="flex-1 space-y-1">
                <div className="relative group">
                  <h3
                    className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-200 leading-relaxed line-clamp-1"
                  >
                    {item.title}
                  </h3>
                <div className="absolute top-0 left-0 transform  -translate-y-full px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action indicator - compact */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ChevronRight
                size={14}
                className="text-red-600"
              />
            </div>

            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-red-200 transition-colors duration-200 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thao tác nhanh</h2>
          <p className="text-gray-600">Các chức năng thường sử dụng nhất</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleMenuClick('/customer-management')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <UserCheck className="text-orange-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Khách hàng</p>
              <p className="text-sm text-gray-500">Quản lý nhanh</p>
            </div>
          </button>
          
          <button
            onClick={() => handleMenuClick('/bank-management')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <CreditCard className="text-indigo-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Ngân hàng</p>
              <p className="text-sm text-gray-500">Tài khoản NH</p>
            </div>
          </button>
          
          <button
            onClick={() => handleMenuClick('/cost-center')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Target className="text-purple-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Chi phí</p>
              <p className="text-sm text-gray-500">Đối tượng tập hợp</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}