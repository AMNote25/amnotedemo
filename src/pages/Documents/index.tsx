import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FilePlus2, FileMinus2, Receipt, ScrollText, ChevronRight } from "lucide-react";

const documentSubMenus = [
  {
    id: "invoice",
    title: "Hóa đơn",
    icon: <FileText size={32} />,
    slug: "/documents/invoice",
    description: "Quản lý hóa đơn bán hàng, mua hàng...",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "contract",
    title: "Hợp đồng",
    icon: <ScrollText size={32} />,
    slug: "/documents/contract",
    description: "Quản lý hợp đồng kinh doanh, dịch vụ...",
    color: "from-green-500 to-green-600",
  },
  {
    id: "receipt",
    title: "Biên lai",
    icon: <Receipt size={32} />,
    slug: "/documents/receipt",
    description: "Quản lý biên lai thu chi, ngân hàng...",
    color: "from-red-500 to-red-600",
  },
  {
    id: "debt-note",
    title: "Giấy báo nợ",
    icon: <FileMinus2 size={32} />,
    slug: "/documents/debt-note",
    description: "Quản lý giấy báo nợ ngân hàng...",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "credit-note",
    title: "Giấy báo có",
    icon: <FilePlus2 size={32} />,
    slug: "/documents/credit-note",
    description: "Quản lý giấy báo có ngân hàng...",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function DocumentsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chứng từ</h1>
            <p className="text-gray-600 mt-2">Danh sách các chức năng quản lý chứng từ</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documentSubMenus.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.slug)}
            className="group relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 active:scale-95"
          >
            <div className="flex flex-row items-center gap-4">
              <div className="w-14 h-14 bg-white border border-gray-300 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-sm">
                <div className="text-black group-hover:text-blue-600">
                  {React.isValidElement(item.icon)
                    ? React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5 text-black group-hover:text-blue-700" })
                    : item.icon}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="relative group">
                  <h3
                    className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 leading-relaxed line-clamp-1"
                  >
                    {item.title}
                  </h3>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ChevronRight
                size={14}
                className="text-blue-600"
              />
            </div>
            <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-200 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
